var colCardPos = "Pursuing";
/*const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('./db/chinook.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});*/




function createColCards()
{
	var text = document.createElement("p");
	text.innerHTML = document.getElementById("CompanyName").value;
	text.classList.add("card-text");

	var cardBody = document.createElement("div");
	cardBody.classList.add("card-body");
	cardBody.classList.add("text-center");

	var cardHeader = document.createElement("button");
	cardHeader.classList.add("card");
	cardHeader.classList.add("bg-primary");

	var card = document.createElement("div");
	card.classList.add("colCard");

	cardBody.appendChild(text);
	cardHeader.appendChild(cardBody);
	card.appendChild(cardHeader);


	document.getElementById(colCardPos).appendChild(card);

	document.getElementById("CompanyName").value = "";
	document.getElementById('PositionTitle').value = "";
}

function setColCardPos(s)
{
	colCardPos = s;
	moveTo = document.getElementById("MoveTo");
	moveTo.innerHTML = s;
}