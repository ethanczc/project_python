import wx
import gui_irrigation_s2_0 as gui
import time
import datetime
import serial
import threading

'''
new version from 1.7, includes stage control (1-3) for light, irrigation
'''

class Irrigation(gui.GuiFrame):
	def __init__(self,parent):
		gui.GuiFrame.__init__(self,parent)
		self.timeNow, self.dateNow = '', ''
		self.serIrrigation = serial.Serial(timeout=0) # create serial object without port address first
		self.serIrrigation.baudrate = 9600 #set serial baudrate
		self.serDoser = serial.Serial(timeout=0) # create serial object without port address first
		self.serDoser.baudrate = 9600 #set serial baudrate
		self.logFile = '' #empty address

		self.light1Stage1On_Timings, self.light1Stage1Off_Timings = [], []
		self.light1Stage2On_Timings, self.light1Stage2Off_Timings = [], []
		self.light1Stage3On_Timings, self.light1Stage3Off_Timings = [], []

		self.ch1Stage1Pump_Timings, self.ch1Stage1Drain_Timings = [], []
		self.ch1Stage2Pump_Timings, self.ch1Stage2Drain_Timings = [], []
		self.ch1Stage3Pump_Timings, self.ch1Stage3Drain_Timings = [], []

		self.ch2Stage1Pump_Timings, self.ch2Stage1Drain_Timings = [], []
		self.ch2Stage2Pump_Timings, self.ch2Stage2Drain_Timings = [], []
		self.ch2Stage3Pump_Timings, self.ch2Stage3Drain_Timings = [], []

		self.tankSize = 0
		self.waterCheckTiming, self.ecCheckTiming = [], []
		self.stage1Ec, self.stage2Ec, self.stage3Ec = 0, 0, 0
		self.ch1Stage1Duration, self.ch1Stage2Duration, self.ch1Stage3Duration = 0, 0, 0
		self.ch2Stage1Duration, self.ch2Stage2Duration, self.ch2Stage3Duration = 0, 0, 0
		self.ch1CurrentStage, self.ch2CurrentStage = 0, 0
		self.temp1, self.temp2 = 0, 0
		self.humidity = 0
		self.ec = 0

	def Tick(self,parent):
		self.TimeDateDisplay()
		self.DaysPassedDisplay()
		self.IrrigationCheck()
		self.DoserCheck()
		self.LightCheck()
		self.CheckIncomingIrrigationSerial()
		self.CheckIncomingDoserSerial()

	def TimeDateDisplay(self):
		self.timeNow = time.strftime('%H:%M:%S')
		self.dateNow = time.strftime('%d/%m/%y')
		self.clock_Display.SetLabel(self.timeNow)
		self.date_Display.SetLabel(self.dateNow)

	def DaysPassedDisplay(self):
		today = datetime.date.today()
		try:
			dateStartInput = (self.startDate_Txtctrl.GetValue()).split('/')
			day = int(dateStartInput[0])
			month = int(dateStartInput[1])
			year = int(dateStartInput[2])
			dateStart = datetime.date(year,month,day)
			daysPassed = (today-dateStart).days
			self.daysPassed_Display.SetLabel(str(daysPassed))
		except:
			pass
		else:
			if daysPassed <= self.ch1Stage1Duration:
				self.ch1CurrentStage = 1
			elif self.ch1Stage1Duration <= daysPassed <= (self.ch1Stage1Duration + self.ch1Stage2Duration):
				self.ch1CurrentStage = 2
			elif (self.ch1Stage1Duration + self.ch1Stage2Duration) <= daysPassed <= (self.ch1Stage1Duration + self.ch1Stage2Duration\
			+ self.ch1Stage3Duration):
				self.ch1CurrentStage = 3
			else:
				self.ch1CurrentStage = 3
			self.ch1CurrentStage_Display.SetLabel(str(self.ch1CurrentStage))
			if daysPassed <= self.ch2Stage1Duration:
				self.ch2CurrentStage = 1
			elif self.ch2Stage1Duration <= daysPassed <= (self.ch2Stage1Duration + self.ch2Stage2Duration):
				self.ch2CurrentStage = 2
			elif (self.ch2Stage1Duration + self.ch2Stage2Duration) <= daysPassed <= (self.ch2Stage1Duration + self.ch2Stage2Duration\
			+ self.ch2Stage3Duration):
				self.ch2CurrentStage = 3
			else:
				self.ch2CurrentStage = 3
			self.ch2CurrentStage_Display.SetLabel(str(self.ch2CurrentStage))

	def LoadRecipe(self,event):
		with wx.FileDialog(self, "Open Text file", wildcard="Text files (*.txt)|*.txt",\
			style=wx.FD_OPEN | wx.FD_FILE_MUST_EXIST) as fileDialog:
			if fileDialog.ShowModal() == wx.ID_CANCEL:
				return
			recipeFile = fileDialog.GetPath()
			try:
				with open(recipeFile, 'r') as file:
					recipeContent = file.readlines()
					self.ReadRecipe(recipeContent)
			except IOError:
				wx.LogError("Cannot open file '%s'." % newfile)

	def ReadRecipe(self,recipeContent):
		for line in range (0,len(recipeContent)):
			thisLine = recipeContent[line][:-1] # splice off \r\n
			thisLine = thisLine.split(' ') #split line into 2 items in an array
			parameter = thisLine[0] # allocate 1st item as parameter
			value = thisLine[1] # allocate 2nd items as value
			if parameter == 'recipe_name':
				self.recipe_Display.SetLabel(str(value))
			if parameter == 'configuration':
				self.config_Txtctrl.SetValue(value)
			if parameter == 'run_number':
				self.run_Txtctrl.SetValue(value)
			if parameter == 'plant_type':
				self.plant_Txtctrl.SetValue(value)
			if parameter == 'led_type':
				self.led_Txtctrl.SetValue(value)
			if parameter == 'start_date':
				self.startDate_Txtctrl.SetValue(value)

			if parameter == 'light1_stage1_on':
				self.light1Stage1On_Timings = value.split(',')
				self.light1Stage1On_Display.SetLabel(str(self.light1Stage1On_Timings))
			if parameter == 'light1_stage1_off':
				self.light1Stage1Off_Timings = value.split(',')
				self.light1Stage1Off_Display.SetLabel(str(self.light1Stage1Off_Timings))
			if parameter == 'light1_stage2_on':
				self.light1Stage2On_Timings = value.split(',')
				self.light1Stage2On_Display.SetLabel(str(self.light1Stage2On_Timings))
			if parameter == 'light1_stage2_off':
				self.light1Stage2Off_Timings = value.split(',')
				self.light1Stage2Off_Display.SetLabel(str(self.light1Stage2Off_Timings))
			if parameter == 'light1_stage3_on':
				self.light1Stage3On_Timings = value.split(',')
				self.light1Stage3On_Display.SetLabel(str(self.light1Stage3On_Timings))
			if parameter == 'light1_stage3_off':
				self.light1Stage3Off_Timings = value.split(',')
				self.light1Stage3Off_Display.SetLabel(str(self.light1Stage3Off_Timings))

			if parameter == 'light2_stage1_on':
				self.light2Stage1On_Timings = value.split(',')
				self.light2Stage1On_Display.SetLabel(str(self.light2Stage1On_Timings))
			if parameter == 'light2_stage1_off':
				self.light2Stage1Off_Timings = value.split(',')
				self.light2Stage1Off_Display.SetLabel(str(self.light2Stage1Off_Timings))
			if parameter == 'light2_stage2_on':
				self.light2Stage2On_Timings = value.split(',')
				self.light2Stage2On_Display.SetLabel(str(self.light2Stage2On_Timings))
			if parameter == 'light2_stage2_off':
				self.light2Stage2Off_Timings = value.split(',')
				self.light2Stage2Off_Display.SetLabel(str(self.light2Stage2Off_Timings))
			if parameter == 'light2_stage3_on':
				self.light2Stage3On_Timings = value.split(',')
				self.light2Stage3On_Display.SetLabel(str(self.light2Stage3On_Timings))
			if parameter == 'light2_stage3_off':
				self.light2Stage3Off_Timings = value.split(',')
				self.light2Stage3Off_Display.SetLabel(str(self.light2Stage3Off_Timings))

			if parameter == 'channel1_stage1_pump':
				self.ch1Stage1Pump_Timings = value.split(',')
				self.pump1Stage1Pump_Display.SetLabel(str(self.ch1Stage1Pump_Timings))
			if parameter == 'channel1_stage1_drain':
				self.ch1Stage1Drain_Timings = value.split(',')
				self.pump1Stage1Drain_Display.SetLabel(str(self.ch1Stage1Drain_Timings))
			if parameter == 'channel1_stage2_pump':
				self.ch1Stage2Pump_Timings = value.split(',')
				self.pump1Stage2Pump_Display.SetLabel(str(self.ch1Stage2Pump_Timings))
			if parameter == 'channel1_stage2_drain':
				self.ch1Stage2Drain_Timings = value.split(',')
				self.pump1Stage2Drain_Display.SetLabel(str(self.ch1Stage2Drain_Timings))
			if parameter == 'channel1_stage3_pump':
				self.ch1Stage3Pump_Timings = value.split(',')
				self.pump1Stage3Pump_Display.SetLabel(str(self.ch1Stage3Pump_Timings))
			if parameter == 'channel1_stage3_drain':
				self.ch1Stage3Drain_Timings = value.split(',')
				self.pump1Stage3Drain_Display.SetLabel(str(self.ch1Stage3Drain_Timings))
			if parameter == 'channel2_stage1_pump':
				self.ch2Stage1Pump_Timings = value.split(',')
				self.pump2Stage1Pump_Display.SetLabel(str(self.ch2Stage1Pump_Timings))
			if parameter == 'channel2_stage1_drain':
				self.ch2Stage1Drain_Timings = value.split(',')
				self.pump2Stage1Drain_Display.SetLabel(str(self.ch2Stage1Drain_Timings))
			if parameter == 'channel2_stage2_pump':
				self.ch2Stage2Pump_Timings = value.split(',')
				self.pump2Stage2Pump_Display.SetLabel(str(self.ch2Stage2Pump_Timings))
			if parameter == 'channel2_stage2_drain':
				self.ch2Stage2Drain_Timings = value.split(',')
				self.pump2Stage2Drain_Display.SetLabel(str(self.ch2Stage2Drain_Timings))
			if parameter == 'channel2_stage3_pump':
				self.ch2Stage3Pump_Timings = value.split(',')
				self.pump2Stage3Pump_Display.SetLabel(str(self.ch2Stage3Pump_Timings))
			if parameter == 'channel2_stage3_drain':
				self.ch2Stage3Drain_Timings = value.split(',')
				self.pump2Stage3Drain_Display.SetLabel(str(self.ch2Stage3Drain_Timings))
			if parameter == 'tank_size':
				self.tankSize = int(value)
				self.tankSize_Display.SetLabel(str(self.tankSize))
			if parameter == 'water_check':
				self.waterCheckTiming = value.split(',')
				self.waterCheck_Display.SetLabel(str(self.waterCheckTiming))
			if parameter == 'ec_check':
				self.ecCheckTiming = value.split(',')
				self.ecCheck_Display.SetLabel(str(self.ecCheckTiming))
			if parameter == 'stage1_ec':
				self.stage1Ec = float(value)
				self.stage1Ec_Display.SetLabel(str(self.stage1Ec))
			if parameter == 'stage2_ec':
				self.stage2Ec = float(value)
				self.stage2Ec_Display.SetLabel(str(self.stage2Ec))
			if parameter == 'stage3_ec':
				self.stage3Ec = float(value)
				self.stage3Ec_Display.SetLabel(str(self.stage3Ec))
			if parameter == 'channel1_stage1_duration':
				self.ch1Stage1Duration = int(value)
				self.ch1Stage1Duration_Display.SetLabel(str(self.ch1Stage1Duration))
			if parameter == 'channel1_stage2_duration':
				self.ch1Stage2Duration = int(value)
				self.ch1Stage2Duration_Display.SetLabel(str(self.ch1Stage2Duration))
			if parameter == 'channel1_stage3_duration':
				self.ch1Stage3Duration = int(value)
				self.ch1Stage3Duration_Display.SetLabel(str(self.ch1Stage3Duration))
			if parameter == 'channel2_stage1_duration':
				self.ch2Stage1Duration = int(value)
				self.ch2Stage1Duration_Display.SetLabel(str(self.ch2Stage1Duration))
			if parameter == 'channel2_stage2_duration':
				self.ch2Stage2Duration = int(value)
				self.ch2Stage2Duration_Display.SetLabel(str(self.ch2Stage2Duration))
			if parameter == 'channel2_stage3_duration':
				self.ch2Stage3Duration = int(value)
				self.ch2Stage3Duration_Display.SetLabel(str(self.ch2Stage3Duration))

	def ConnectIrrigationSerial(self,event):
		serialAddress = self.irrigationPort_Cbox.GetValue()
		self.serIrrigation.port = str(serialAddress) #define serial port address here
		try:
			self.serIrrigation.open() #open serial port
		except:
			self.irrigationPort_Display.SetLabel('failed')
		else:
			self.irrigationPort_Display.SetLabel(serialAddress)

	def ConnectDoserSerial(self,event):
		serialAddress = self.doserPort_Cbox.GetValue()
		self.serDoser.port = str(serialAddress) #define serial port address here
		try:
			self.serDoser.open() #open serial port
		except:
			self.doserPort_Display.SetLabel('failed')
		else:
			self.doserPort_Display.SetLabel(serialAddress)

	def SendIrrigationSerial(self,event):
		serialIrrigationInput = self.serialIrrigationInput_Txtctrl.GetValue()
		if serialIrrigationInput == '':
			print('no message')
		else:
			try:
				self.serIrrigation.write(serialIrrigationInput.encode())
			except:
				print('unable to send serial data')

	def SendDoserSerial(self,event):
		serialDoserInput = self.serialDoserInput_Txtctrl.GetValue()
		if serialDoserInput == '':
			print('no message')
		else:
			try:
				self.serDoser.write(serialDoserInput.encode())
			except:
				print('unable to send serial data')

	def LoadLog(self,event):
		with wx.FileDialog(self, "Open Text file", wildcard="Text files (*.txt)|*.txt",\
			style=wx.FD_OPEN | wx.FD_FILE_MUST_EXIST) as fileDialog:
			if fileDialog.ShowModal() == wx.ID_CANCEL:
				return
			self.logFile = fileDialog.GetPath()
			logFileSplit = self.logFile.split('/') #split the path
			self.log_Display.SetLabel(logFileSplit[-1]) # only display the file name from the path

	def DoserCheck(self):
		if self.autoDoser_ToggleBtn.GetValue() == True:
			for thisTime in self.waterCheckTiming:
				if thisTime == self.timeNow:
					self.DoserPumpFunction(1)
			for thisTime in self.ecCheckTiming:
				if thisTime == self.timeNow:
					self.EcDoseFunction()

	def DoserPumpFunction(self,state):
		self.serDoser.write(('PU {}'.format(state)).encode())
	
	def EcDoseFunction(self):
		self.serDoser.write(('AEC 1').encode())

	def EcDose(self,ecValue):
		self.ShowEc(ecValue)
		nutrientVolume = 0
		EcFactor = 100.0
		if ecValue == 0 or ecValue == 100:
			nutrientVolume = 0
		elif ch1CurrentStage == 1:
			nutrientVolume = (stage1Ec - ecValue) * float(tankSize / EcFactor)
		elif ch1CurrentStage == 2:
			nutrientVolume = (stage2Ec - ecValue) * float(tankSize / EcFactor)
		elif ch1CurrentStage == 3:
			nutrientVolume = (stage3Ec - ecValue) * float(tankSize / EcFactor)
		nutrientVolume = int(round(nutrientVolume))
		if nutrientVolume <= 0:
			pass
		else:
			serDoser.write(('NP {}'.format(nutrientVolume/2)).encode())

	def LightCheck(self):
		if self.autoLight1_ToggleBtn.GetValue() == True:
			if self.ch1CurrentStage == 1:
				for thisTime in self.light1Stage1On_Timings:
					if thisTime == self.timeNow:
						self.LightFunction(1,1)
				for thisTime in self.light1Stage1Off_Timings:
					if thisTime == self.timeNow:
						self.LightFunction(1,0)
			elif self.ch1CurrentStage == 2:
				for thisTime in self.light1Stage2On_Timings:
					if thisTime == self.timeNow:
						self.LightFunction(1,1)
				for thisTime in self.light1Stage2Off_Timings:
					if thisTime == self.timeNow:
						self.LightFunction(1,0)
			elif self.ch1CurrentStage == 3:
				for thisTime in self.light1Stage3On_Timings:
					if thisTime == self.timeNow:
						self.LightFunction(1,1)
				for thisTime in self.light1Stage3Off_Timings:
					if thisTime == self.timeNow:
						self.LightFunction(1,0)

		if self.autoLight2_ToggleBtn.GetValue() == True:
			if self.ch2CurrentStage == 1:
				for thisTime in self.light2Stage1On_Timings:
					if thisTime == self.timeNow:
						self.LightFunction(2,1)
				for thisTime in self.light2Stage1Off_Timings:
					if thisTime == self.timeNow:
						self.LightFunction(2,0)
			elif self.ch2CurrentStage == 2:
				for thisTime in self.light2Stage2On_Timings:
					if thisTime == self.timeNow:
						self.LightFunction(2,1)
				for thisTime in self.light2Stage2Off_Timings:
					if thisTime == self.timeNow:
						self.LightFunction(2,0)
			elif self.ch2CurrentStage == 3:
				for thisTime in self.light2Stage3On_Timings:
					if thisTime == self.timeNow:
						self.LightFunction(2,1)
				for thisTime in self.light2Stage3Off_Timings:
					if thisTime == self.timeNow:
						self.LightFunction(2,0)

	def LightFunction(self,light,state):
		self.serIrrigation.write(('LT{} {}'.format(light,state)).encode())
		#print('LT{} {}'.format(light,state))

	def IrrigationCheck(self):
		if self.autoPump1_ToggleBtn.GetValue() == True:
			if self.ch1CurrentStage == 1:
				for thisTime in self.ch1Stage1Pump_Timings:
					if thisTime == self.timeNow:
						self.PumpFunction(1,1)
				for thisTime in self.ch1Stage1Drain_Timings:
					if thisTime == self.timeNow:
						self.DrainFunction(1,1)
			elif self.ch1CurrentStage == 2:
				for thisTime in self.ch1Stage2Pump_Timings:
					if thisTime == self.timeNow:
						self.self.PumpFunction(1,1)
				for thisTime in self.ch1Stage2Drain_Timings:
					if thisTime == self.timeNow:
						self.DrainFunction(1,1)
			elif self.ch1CurrentStage == 3:
				for thisTime in self.ch1Stage3Pump_Timings:
					if thisTime == self.timeNow:
						self.PumpFunction(1,1)
				for thisTime in self.ch1Stage3Drain_Timings:
					if thisTime == self.timeNow:
						self.DrainFunction(1,1)
		if self.autoPump2_ToggleBtn.GetValue() == True:
			if self.ch2CurrentStage == 1:
				for thisTime in self.ch2Stage1Pump_Timings:
					if thisTime == self.timeNow:
						self.PumpFunction(2,1)
				for thisTime in self.ch2Stage1Drain_Timings:
					if thisTime == self.timeNow:
						self.DrainFunction(2,1)
			if self.ch2CurrentStage == 2:
				for thisTime in self.ch2Stage2Pump_Timings:
					if thisTime == self.timeNow:
						self.PumpFunction(2,1)
				for thisTime in self.ch2Stage2Drain_Timings:
					if thisTime == self.timeNow:
						self.DrainFunction(2,1)
			if self.ch2CurrentStage == 3:
				for thisTime in self.ch2Stage3Pump_Timings:
					if thisTime == self.timeNow:
						self.PumpFunction(2,1)
				for thisTime in self.ch2Stage3Drain_Timings:
					if thisTime == self.timeNow:
						self.DrainFunction(2,1)

	def PumpFunction(self,pump,state):
		self.serIrrigation.write(('PU{} {}'.format(pump,state)).encode())
		#print('PU{} {}'.format(pump,state))

	def DrainFunction(self,drain,state):
		self.serIrrigation.write(('DR{} {}'.format(drain,state)).encode())
		#print('DR{} {}'.format(drain,state))

	def CheckIrrigation1Fields(self,event):
		if self.serIrrigation.isOpen() == False or not self.ch1Stage1Pump_Timings:
			print ('unable to AUTO')
			self.autoPump1_ToggleBtn.SetValue(False)

	def CheckIrrigation2Fields(self,event):
		if self.serIrrigation.isOpen() == False or not self.ch2Stage1Pump_Timings:
			print ('unable to AUTO')
			self.autoPump2_ToggleBtn.SetValue(False)

	def CheckDoserFields(self,event):
		if self.serDoser.isOpen() == False or not self.waterCheckTiming:
			print('unable to AUTO')
			self.autoDoser_ToggleBtn.SetValue(False)

	def CheckLight1Fields(self,event):
		if self.serIrrigation.isOpen() == False or not self.light1Stage1On_Timings:
			print('unable to AUTO')
			self.autoLight1_ToggleBtn.SetValue(False)

	def CheckLight2Fields(self,event):
		if self.serIrrigation.isOpen() == False or not self.light2Stage1On_Timings:
			print('unable to AUTO')
			self.autoLight2_ToggleBtn.SetValue(False)

	def CheckIncomingIrrigationSerial(self):
		try:
			rawData = self.serIrrigation.readline()
		except:
			pass
		else:
			self.SerialDataProcessor(rawData)

	def CheckIncomingDoserSerial(self):
		try:
			rawData = self.serDoser.readline()
		except:
			pass
		else:
			self.SerialDataProcessor(rawData)
			
	def SerialDataProcessor(self,rawData):
		try:
			rawData = rawData.decode('utf-8')
			rawData = rawData[:-2]
			rawDataList = rawData.split(' ')
			dataType = rawDataList[0]
			value = float(rawDataList[1])
		except:
			pass
		else:
			self.CheckData(dataType,value)

	def CheckData(self,dataType,value):
		if dataType == 'TP1' or dataType == 'TP2':
			self.ShowTemperature(dataType,value)
		elif dataType == 'HM1':
			self.ShowHumidity(value)
		elif dataType == 'EC':
			self.ShowEc(value)
		elif dataType == 'AEC':
			self.EcDose(value)
		elif dataType == 'INT':
			print ('INT 1')
		elif dataType == 'ECPU1':
			print ('PU1 activated')
		elif dataType == 'ECDR1':
			print('DR1 activated')

	def ShowEc(self,ecValue):
		self.ec = ecValue
		self.ec_Display.SetLabel(str(self.ec))

	def ShowTemperature(self,sensor,temperature):
		if sensor == 'TP1':
			self.temp1 = temperature
			self.temp1_Display.SetLabel(str(self.temp1))
		elif sensor == 'TP2':
			self.temp2 = temperature
			self.temp2_Display.SetLabel(str(self.temp2))
		tempA = round (((self.temp1 + self.temp2)/2),2)
		self.tempA_Display.SetLabel(str(tempA))

	def ShowHumidity(self,humidity):
		self.humidity = humidity
		self.humidity_Display.SetLabel(str(self.humidity))

	def UpdateSensorsIntervals(self,event):
		if self.tempInterval_Txtctrl.GetValue() != '' and self.humidityInterval_Txtctrl.GetValue() != '':
			tempInterval = self.tempInterval_Txtctrl.GetValue()
			humidityInterval = self.humidityInterval_Txtctrl.GetValue()
			try:
				self.serIrrigation.write(('TP0 {}\r\n'.format(tempInterval)).encode())
				self.serIrrigation.write(('HM0 {}'.format(humidityInterval)).encode())
			except:
				print('no serial connection')

def main():
	app = wx.App(False)
	frame = Irrigation(None)
	frame.Show(True)
	app.MainLoop()

if __name__ == '__main__':
	main()
