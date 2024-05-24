const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");
const { Firestore } = require('@google-cloud/firestore');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: label,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  await storeData(id, data);

  const response = h
    .response({
      status: "success",
      message: "Model is predicted successfully",
      data: data,
    })
    .code(201);

  return response;
}

async function getPredictHistoriesHandler(request, h) {
  let histories = [];
  
  const db = new Firestore({
    databaseId: "cancer-ml-db",
  });
  const predictionCollection = db.collection("predictions");
  const predictionSnapshots = await predictionCollection.get();

  predictionSnapshots.forEach((document) => {
    const documentId = document.id;
    const documentData = document.data();

    const historyData = {
      id: documentId,
      history: documentData,
    };
    histories.push(historyData);
  });

  const response = h
    .response({
      status: "success",
      data: histories,
    })
  
  response.code(200);

  return response;
}

module.exports = { postPredictHandler, getPredictHistoriesHandler };
