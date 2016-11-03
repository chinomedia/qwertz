/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  update
 * DELETE  /api/things/:id          ->  destroy
 */

'use strict';


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  console.log('respinde');
  return res;

}


// Creates a new Thing in the DB
export function create(req, res) {
  console.log('fine');
  var calculations = req.body;
  var grundpreis = 135;
  var aufpreisAuto = 20;
  var aufpreisTeil = 20;
  var aufpreisBeule = 40;
  var partSizes = 0;
  console.log('fine');

  //DUMMER ALGORITHMUS FÜR TEILGRÖssE
  if(calculations.selected.indexOf((3) != -1)  ){
    partSizes = partSizes + 2;
  }
  if(calculations.selected.indexOf((1) != -1)  ){
    partSizes = partSizes + 2;
  }
  if(calculations.selected.indexOf((11) != -1)  ){
    partSizes = partSizes + 1;
  }
  if(calculations.selected.indexOf((10) != -1)  ){
    partSizes = partSizes + 1;
  }
  if(calculations.selected.indexOf((9) != -1)  ){
    partSizes = partSizes + 1;
  }
  if(calculations.selected.indexOf((12) != -1)  ){
    partSizes = partSizes + 1;
  }
  if(calculations.selected.indexOf((2) != -1)  ){
    partSizes = partSizes + 1;
  }

  var calculation = 0;
  var calculation = (calculations.selected.length)* grundpreis;
  calculation = calculation + calculations.carSize * aufpreisAuto;
  calculation = calculation + partSizes * aufpreisTeil;
  console.log(calculation);
  if(calculations.deformation){
    calculation = calculation +  (aufpreisBeule *calculations.selected.length) ;
  }

  console.log(calculation);
  res.calculation = calculation;
  res.send({calc: calculation});
}



