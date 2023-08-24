var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cors = require("cors");
const fs = require("fs");
const { time } = require("console");

var app = express();

app.use(bodyParser());
app.use(cors());

const IoTData = mongoose.model("data", {
	time: String,
	can: {
		id: String,
		percentage: String,
	},
});

app.post("/log", async (req, resp) => {
	console.log(req.body);
	try {
		const time = req.body.time;
		const canId = req.body.id;
		const canPercentage = req.body.percentage;

		console.log(`time:${time}/ id:${canId}/ percentage:${canPercentage}`);
		const doc = new IoTData({
			time: time,
			can: {
				id: canId,
				percentage: canPercentage,
			},
		});

		await doc.save();

		resp.status(200).json({ status: "OK" });
	} catch (err) {
		console.error(err);
		resp.status(500).json({ status: "Not OK", error: err.message });
	}
});

let check = false;

app.get("/testies", (req, res) => {
	if (check) {
		check = false;
		res.status(200);
		res.json([{ piw: "piw" }, { piw: "piw" }]);
	} else {
		check = true;
		res.status(200);
		res.json([{ piw: "diw" }, { piw: "diw" }]);
	}
});

mongoose
	.connect(
		"mongodb+srv://slimanirayene:0000@pitchecluster.qost1.mongodb.net/smart-can?retryWrites=true&w=majority"
	)
	.then((db) => {
		console.log("Database connected");
	})
	.catch((err) => {
		console.log(err);
	});

app.listen(5000);
