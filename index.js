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
	let time = req.body.time;
	let canId = req.body.id;
	let canPercentage = req.body.percentage;

	const doc = new IoTData({
		time: time,
		can: {
			id: canId,
			percentage: canPercentage,
		},
	});

	doc
		.save()
		.then(() => {
			resp.status(200).json({ status: "OK" });
		})
		.catch((err) => {
			resp.status(500).json({ status: "Not OK" });
			console.log(err);
		});
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
		"mongodb+srv://slimanirayene:0000@pitchecluster.qost1.mongodb.net/smart-can ?retryWrites=true&w=majority"
	)
	.then((db) => {
		console.log("Database connected");
	})
	.catch((err) => {
		console.log(err);
	});

app.listen(2000);
