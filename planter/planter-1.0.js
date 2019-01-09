[
    {
        "id": "b6f8c514.5c244",
        "type": "tab",
        "label": "planter-1.0",
        "disabled": false,
        "info": "flow that works with planter-1.0.py"
    },
    {
        "id": "ea7d4808.065f1",
        "type": "inject",
        "z": "b6f8c514.5c244",
        "name": "CLOCK",
        "topic": "CLK",
        "payload": "CLK 1",
        "payloadType": "str",
        "repeat": "1",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "x": 180,
        "y": 60,
        "wires": [
            [
                "f983f108.38073"
            ]
        ]
    },
    {
        "id": "f983f108.38073",
        "type": "mqtt out",
        "z": "b6f8c514.5c244",
        "name": "",
        "topic": "RACK1S",
        "qos": "2",
        "retain": "",
        "broker": "a113a6e8.11ab8",
        "x": 380,
        "y": 60,
        "wires": []
    },
    {
        "id": "c4059a46.cda948",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "Load button",
        "group": "3a5c78d6.216098",
        "order": 1,
        "width": 0,
        "height": 0,
        "passthru": false,
        "label": "LOAD",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "LOAD 1",
        "payloadType": "str",
        "topic": "",
        "x": 170,
        "y": 120,
        "wires": [
            [
                "94a30abf.786988"
            ]
        ]
    },
    {
        "id": "94a30abf.786988",
        "type": "mqtt out",
        "z": "b6f8c514.5c244",
        "name": "",
        "topic": "RACK1S",
        "qos": "2",
        "retain": "",
        "broker": "a113a6e8.11ab8",
        "x": 380,
        "y": 120,
        "wires": []
    },
    {
        "id": "f82bcc7a.c046e",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "Change state button",
        "group": "e00c96df.03e3d8",
        "order": 1,
        "width": 0,
        "height": 0,
        "passthru": false,
        "label": "CHANGE STATE",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "STATE 1",
        "payloadType": "str",
        "topic": "",
        "x": 140,
        "y": 180,
        "wires": [
            [
                "31ec6ea3.3644ca"
            ]
        ]
    },
    {
        "id": "31ec6ea3.3644ca",
        "type": "mqtt out",
        "z": "b6f8c514.5c244",
        "name": "",
        "topic": "RACK1S",
        "qos": "2",
        "retain": "",
        "broker": "a113a6e8.11ab8",
        "x": 380,
        "y": 180,
        "wires": []
    },
    {
        "id": "4d766b3f.0d9684",
        "type": "mqtt in",
        "z": "b6f8c514.5c244",
        "name": "",
        "topic": "RACKSTATUS",
        "qos": "2",
        "broker": "a113a6e8.11ab8",
        "x": 100,
        "y": 400,
        "wires": [
            [
                "d7f13271.1009c8"
            ]
        ]
    },
    {
        "id": "d7f13271.1009c8",
        "type": "json",
        "z": "b6f8c514.5c244",
        "name": "",
        "property": "payload",
        "action": "",
        "pretty": false,
        "x": 270,
        "y": 400,
        "wires": [
            [
                "a4880a4d.41fad8",
                "fd51a251.48e5a8"
            ]
        ]
    },
    {
        "id": "a4880a4d.41fad8",
        "type": "function",
        "z": "b6f8c514.5c244",
        "name": "filter parameters",
        "func": "var message = msg.payload\nif (message.name == \"parameters\") {\n    var recipe_name = {payload: message.recipe_name}\n    var configuration = {payload: message.configuration}\n    var run_number = {payload: message.run_number}\n    var plant_type = {payload: message.plant_type}\n    var led_type = {payload: message.led_type}\n    var start_date = {payload: message.start_date}\n}\nreturn [recipe_name,configuration,run_number,plant_type,led_type,start_date];",
        "outputs": 6,
        "noerr": 0,
        "x": 480,
        "y": 320,
        "wires": [
            [
                "9d10d61f.b078b8"
            ],
            [
                "27279862.c019a"
            ],
            [
                "c71f56b7.4115d"
            ],
            [
                "92abc359.bb6f3"
            ],
            [
                "c242c71c.fe2178"
            ],
            [
                "d5fb70cd.c1b61"
            ]
        ]
    },
    {
        "id": "9d10d61f.b078b8",
        "type": "ui_text",
        "z": "b6f8c514.5c244",
        "group": "3a5c78d6.216098",
        "order": 3,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "Recipe Name",
        "format": "{{msg.payload}}",
        "layout": "row-spread",
        "x": 720,
        "y": 220,
        "wires": []
    },
    {
        "id": "27279862.c019a",
        "type": "ui_text",
        "z": "b6f8c514.5c244",
        "group": "3a5c78d6.216098",
        "order": 4,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "Configuration",
        "format": "{{msg.payload}}",
        "layout": "row-spread",
        "x": 710,
        "y": 260,
        "wires": []
    },
    {
        "id": "c71f56b7.4115d",
        "type": "ui_text",
        "z": "b6f8c514.5c244",
        "group": "3a5c78d6.216098",
        "order": 5,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "Run Number",
        "format": "{{msg.payload}}",
        "layout": "row-spread",
        "x": 710,
        "y": 300,
        "wires": []
    },
    {
        "id": "92abc359.bb6f3",
        "type": "ui_text",
        "z": "b6f8c514.5c244",
        "group": "3a5c78d6.216098",
        "order": 6,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "Plant type",
        "format": "{{msg.payload}}",
        "layout": "row-spread",
        "x": 700,
        "y": 340,
        "wires": []
    },
    {
        "id": "c242c71c.fe2178",
        "type": "ui_text",
        "z": "b6f8c514.5c244",
        "group": "3a5c78d6.216098",
        "order": 7,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "led type",
        "format": "{{msg.payload}}",
        "layout": "row-spread",
        "x": 700,
        "y": 380,
        "wires": []
    },
    {
        "id": "d5fb70cd.c1b61",
        "type": "ui_text",
        "z": "b6f8c514.5c244",
        "group": "3a5c78d6.216098",
        "order": 8,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "Start Date",
        "format": "{{msg.payload}}",
        "layout": "row-spread",
        "x": 700,
        "y": 420,
        "wires": []
    },
    {
        "id": "e576ff.098449",
        "type": "function",
        "z": "b6f8c514.5c244",
        "name": "Change Mode",
        "func": "var message = msg.payload;\nvar autoMessage = {payload: \"AUTO\"}\nvar manualMessage = {payload: \"MANUAL\" }\n\nif (message == \"STATE 1\") {\n    return [autoMessage,[]];\n}\nelse if (message == \"STATE 0\") {\n    return [[], manualMessage];\n}",
        "outputs": 2,
        "noerr": 0,
        "x": 360,
        "y": 580,
        "wires": [
            [
                "3d85561f.76071a"
            ],
            [
                "fad07fd1.4c6fb"
            ]
        ]
    },
    {
        "id": "46eaea94.6f66b4",
        "type": "ui_text",
        "z": "b6f8c514.5c244",
        "group": "e00c96df.03e3d8",
        "order": 2,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "MODE",
        "format": "<font color= {{msg.color}}>{{msg.payload}}</font>",
        "layout": "row-spread",
        "x": 750,
        "y": 580,
        "wires": []
    },
    {
        "id": "fd51a251.48e5a8",
        "type": "function",
        "z": "b6f8c514.5c244",
        "name": "filter status",
        "func": "var status = msg.payload\nif (status.name == \"status\") {\n    var daysPassed = {payload: status.daysPassed}\n    var currentStage = {payload: status.currentStage}\n}\nreturn [daysPassed,currentStage];",
        "outputs": 2,
        "noerr": 0,
        "x": 470,
        "y": 500,
        "wires": [
            [
                "c29d4d1b.bfe7"
            ],
            [
                "4118830e.1f9bac"
            ]
        ]
    },
    {
        "id": "4118830e.1f9bac",
        "type": "ui_text",
        "z": "b6f8c514.5c244",
        "group": "3a5c78d6.216098",
        "order": 11,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "Current Stage",
        "format": "{{msg.payload}}",
        "layout": "row-spread",
        "x": 720,
        "y": 520,
        "wires": []
    },
    {
        "id": "c29d4d1b.bfe7",
        "type": "ui_text",
        "z": "b6f8c514.5c244",
        "group": "3a5c78d6.216098",
        "order": 10,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "Days Passed",
        "format": "{{msg.payload}}",
        "layout": "row-spread",
        "x": 710,
        "y": 480,
        "wires": []
    },
    {
        "id": "a2ffc9a2.b53c",
        "type": "mqtt in",
        "z": "b6f8c514.5c244",
        "name": "",
        "topic": "RACK1",
        "qos": "2",
        "broker": "a113a6e8.11ab8",
        "x": 150,
        "y": 660,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "e13b924.efd857",
        "type": "function",
        "z": "b6f8c514.5c244",
        "name": "Command Parser",
        "func": "var output = {payload:msg.payload};\n\nvar words = msg.payload.split(\" \");\nif (words[0]==\"PU1\" || words[0]==\"DR1\" || \nwords[0]==\"PU2\" || words[0]==\"DR2\" ||\nwords[0]==\"PU3\" || words[0]==\"DR3\" ||\nwords[0]==\"PU4\" || words[0]==\"DR4\") {\n    return [output,[],[]];\n}\nif (words[0]==\"LP1\" || words[0]==\"LD1\" ||\nwords[0]==\"LP2\" || words[0]==\"LD2\" ||\nwords[0]==\"LP3\" || words[0]==\"LD3\") {\n    return [[],output,[]];\n}\nif (words[0]==\"AEC\" || words[0]==\"EC\" ||\nwords[0]==\"NP\" || words[0]==\"PU\" ||\nwords[0]==\"NPA\" || words[0]==\"NPB\") {\n    return [[],[],output];\n}",
        "outputs": 3,
        "noerr": 0,
        "x": 450,
        "y": 740,
        "wires": [
            [
                "f755e2f5.43c4f8"
            ],
            [
                "76aca8dd.1c6be8"
            ],
            [
                "917fd688.cbd388"
            ]
        ]
    },
    {
        "id": "e50bab47.c6b7e",
        "type": "ui_text_input",
        "z": "b6f8c514.5c244",
        "name": "",
        "label": "Manual cmd",
        "tooltip": "",
        "group": "e00c96df.03e3d8",
        "order": 3,
        "width": 0,
        "height": 0,
        "passthru": true,
        "mode": "text",
        "delay": "0",
        "topic": "",
        "x": 130,
        "y": 720,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "76aca8dd.1c6be8",
        "type": "debug",
        "z": "b6f8c514.5c244",
        "name": "USB1",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "x": 750,
        "y": 740,
        "wires": []
    },
    {
        "id": "917fd688.cbd388",
        "type": "debug",
        "z": "b6f8c514.5c244",
        "name": "USB2",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "x": 750,
        "y": 780,
        "wires": []
    },
    {
        "id": "49f88248.585b3c",
        "type": "mqtt in",
        "z": "b6f8c514.5c244",
        "name": "",
        "topic": "RACK1",
        "qos": "2",
        "broker": "a113a6e8.11ab8",
        "x": 170,
        "y": 580,
        "wires": [
            [
                "e576ff.098449"
            ]
        ]
    },
    {
        "id": "3d85561f.76071a",
        "type": "change",
        "z": "b6f8c514.5c244",
        "name": "auto set green",
        "rules": [
            {
                "t": "set",
                "p": "color",
                "pt": "msg",
                "to": "lime",
                "tot": "str"
            }
        ],
        "action": "",
        "property": "",
        "from": "",
        "to": "",
        "reg": false,
        "x": 560,
        "y": 560,
        "wires": [
            [
                "46eaea94.6f66b4"
            ]
        ]
    },
    {
        "id": "fad07fd1.4c6fb",
        "type": "change",
        "z": "b6f8c514.5c244",
        "name": "manual sett red",
        "rules": [
            {
                "t": "set",
                "p": "color",
                "pt": "msg",
                "to": "red",
                "tot": "str"
            }
        ],
        "action": "",
        "property": "",
        "from": "",
        "to": "",
        "reg": false,
        "x": 560,
        "y": 600,
        "wires": [
            [
                "46eaea94.6f66b4"
            ]
        ]
    },
    {
        "id": "f755e2f5.43c4f8",
        "type": "debug",
        "z": "b6f8c514.5c244",
        "name": "USB0",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "x": 750,
        "y": 700,
        "wires": []
    },
    {
        "id": "50f36f77.d0553",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH1 PUMP ON",
        "group": "8feed448.033828",
        "order": 3,
        "width": "3",
        "height": "2",
        "passthru": false,
        "label": "PUMP ON",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "PU1 1",
        "payloadType": "str",
        "topic": "",
        "x": 200,
        "y": 780,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "bda99669.37fb68",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH1 PUMP OFF",
        "group": "8feed448.033828",
        "order": 3,
        "width": "3",
        "height": "2",
        "passthru": false,
        "label": "PUMP OFF",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "PU1 0",
        "payloadType": "str",
        "topic": "",
        "x": 200,
        "y": 820,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "8eb92d69.dca43",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH1 DRAIN ON",
        "group": "8feed448.033828",
        "order": 3,
        "width": "3",
        "height": "2",
        "passthru": false,
        "label": "DRAIN ON",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "DR1 1",
        "payloadType": "str",
        "topic": "",
        "x": 200,
        "y": 860,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "267f2356.d50c0c",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH1 DRAIN OFF",
        "group": "8feed448.033828",
        "order": 3,
        "width": "3",
        "height": "2",
        "passthru": false,
        "label": "DRAIN OFF",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "DR1 0",
        "payloadType": "str",
        "topic": "",
        "x": 190,
        "y": 900,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "68b99e9a.926b48",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "FILL TANK",
        "group": "e00c96df.03e3d8",
        "order": 3,
        "width": "6",
        "height": "2",
        "passthru": false,
        "label": "FILL TANK",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "PU 1",
        "payloadType": "str",
        "topic": "",
        "x": 210,
        "y": 960,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "a588bb38.95a4a",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CHECK EC",
        "group": "e00c96df.03e3d8",
        "order": 3,
        "width": "6",
        "height": "2",
        "passthru": false,
        "label": "CHECK EC",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "EC 1",
        "payloadType": "str",
        "topic": "",
        "x": 210,
        "y": 1000,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "a9b750c7.7d07f",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "ADD NUTRIENTS",
        "group": "e00c96df.03e3d8",
        "order": 3,
        "width": "6",
        "height": "2",
        "passthru": false,
        "label": "ADD NUTRIENTS",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "AEC 1",
        "payloadType": "str",
        "topic": "",
        "x": 190,
        "y": 1040,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "1f3597f4.efee08",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH1 LIGHT ON",
        "group": "8feed448.033828",
        "order": 3,
        "width": "3",
        "height": "2",
        "passthru": false,
        "label": "LIGHT ON",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "LP1 100",
        "payloadType": "str",
        "topic": "",
        "x": 460,
        "y": 840,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "2133cc04.7e783c",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH1 LIGHT OFF",
        "group": "8feed448.033828",
        "order": 3,
        "width": "3",
        "height": "2",
        "passthru": false,
        "label": "LIGHT OFF",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "LP1 0",
        "payloadType": "str",
        "topic": "",
        "x": 450,
        "y": 880,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "495895d2.27f5bc",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH1 LIGHT HOME",
        "group": "8feed448.033828",
        "order": 3,
        "width": "6",
        "height": "3",
        "passthru": false,
        "label": "LIGHT HOME",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "LD1 0",
        "payloadType": "str",
        "topic": "",
        "x": 450,
        "y": 920,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "2a055cf2.24a7b4",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH2 PUMP ON",
        "group": "e648d74.e787f28",
        "order": 3,
        "width": "3",
        "height": "2",
        "passthru": false,
        "label": "PUMP ON",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "PU2 1",
        "payloadType": "str",
        "topic": "",
        "x": 200,
        "y": 1100,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "d21743b8.2a3f88",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH2 PUMP OFF",
        "group": "e648d74.e787f28",
        "order": 3,
        "width": "3",
        "height": "2",
        "passthru": false,
        "label": "PUMP OFF",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "PU2 0",
        "payloadType": "str",
        "topic": "",
        "x": 200,
        "y": 1140,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "30ed054b.f059fa",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH2 DRAIN ON",
        "group": "e648d74.e787f28",
        "order": 3,
        "width": "3",
        "height": "2",
        "passthru": false,
        "label": "DRAIN ON",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "DR2 1",
        "payloadType": "str",
        "topic": "",
        "x": 200,
        "y": 1180,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "85a06bf5.df6a9",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH2 DRAIN OFF",
        "group": "e648d74.e787f28",
        "order": 3,
        "width": "3",
        "height": "2",
        "passthru": false,
        "label": "DRAIN OFF",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "DR2 0",
        "payloadType": "str",
        "topic": "",
        "x": 190,
        "y": 1220,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "dafdc64e.98f89",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH2 LIGHT ON",
        "group": "e648d74.e787f28",
        "order": 3,
        "width": "3",
        "height": "2",
        "passthru": false,
        "label": "LIGHT ON",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "LP2 100",
        "payloadType": "str",
        "topic": "",
        "x": 460,
        "y": 980,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "ed9ab00f.6e05d",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH2 LIGHT OFF",
        "group": "e648d74.e787f28",
        "order": 3,
        "width": "3",
        "height": "2",
        "passthru": false,
        "label": "LIGHT OFF",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "LP2 0",
        "payloadType": "str",
        "topic": "",
        "x": 450,
        "y": 1020,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "c76b99e6.58a42",
        "type": "ui_button",
        "z": "b6f8c514.5c244",
        "name": "CH2 LIGHT HOME",
        "group": "e648d74.e787f28",
        "order": 3,
        "width": "6",
        "height": "3",
        "passthru": false,
        "label": "LIGHT HOME",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "LD2 0",
        "payloadType": "str",
        "topic": "",
        "x": 450,
        "y": 1060,
        "wires": [
            [
                "e13b924.efd857"
            ]
        ]
    },
    {
        "id": "a113a6e8.11ab8",
        "type": "mqtt-broker",
        "z": "",
        "name": "localhost",
        "broker": "localhost",
        "port": "1883",
        "clientid": "",
        "usetls": false,
        "compatmode": true,
        "keepalive": "60",
        "cleansession": true,
        "birthTopic": "",
        "birthQos": "0",
        "birthPayload": "",
        "closeTopic": "",
        "closeQos": "0",
        "closePayload": "",
        "willTopic": "",
        "willQos": "0",
        "willPayload": ""
    },
    {
        "id": "3a5c78d6.216098",
        "type": "ui_group",
        "z": "",
        "name": "STATUS",
        "tab": "e8600836.0163f8",
        "order": 1,
        "disp": true,
        "width": "6",
        "collapse": false
    },
    {
        "id": "e00c96df.03e3d8",
        "type": "ui_group",
        "z": "",
        "name": "CONTROL MAIN",
        "tab": "e8600836.0163f8",
        "order": 2,
        "disp": true,
        "width": "6",
        "collapse": false
    },
    {
        "id": "8feed448.033828",
        "type": "ui_group",
        "z": "",
        "name": "CONTROL CHANNEL 1",
        "tab": "e8600836.0163f8",
        "order": 3,
        "disp": true,
        "width": "6",
        "collapse": false
    },
    {
        "id": "e648d74.e787f28",
        "type": "ui_group",
        "z": "",
        "name": "CONTROL CHANNEL 2",
        "tab": "e8600836.0163f8",
        "order": 4,
        "disp": true,
        "width": "6",
        "collapse": false
    },
    {
        "id": "e8600836.0163f8",
        "type": "ui_tab",
        "z": "",
        "name": "Planter",
        "icon": "dashboard",
        "order": 1,
        "disabled": false,
        "hidden": false
    }
]
