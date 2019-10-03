var colCardPos = "Pursuing";
var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./portfolios.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log(err.message);
  }
  else
  {
  	console.log('Connected to the Portfolios database.');	
  }  
});

function createDataBaseonLoad()
{
	db.run('CREATE TABLE IF NOT EXISTS Portfolios(CompanyName TEXT PRIMARY KEY, PositionTitle TEXT NOT NULL, Url TEXT NOT NULL, Notes TEXT NOT NULL, ColCardPosition TEXT NOT NULL)');
	developOnLoad();
}

function developOnLoad()
{
	db.each('SELECT * FROM Portfolios', (error, row) =>
	{
		if (error)
		{
			throw error;
		}
		else
		{
			if (row != null)
			{
				createColCardsOnLoad(row.CompanyName, row.ColCardPosition);
			}
		}
	});
}

function createColCardsOnLoad(CompanyName, colCardPosition)
{
	var text = document.createElement("p");
	text.innerHTML = CompanyName;
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


	document.getElementById(colCardPosition).appendChild(card);
}

function updateDataBase(pCompanyName, pPositionTitle, pUrl, pNotes, pColCardPosition)
{
	db.run('INSERT INTO Portfolios (CompanyName, PositionTitle, Url, Notes, ColCardPosition) VALUES ($CompanyName, $PositionTitle, $Url, $Notes, $ColCardPosition)',
	{
		$CompanyName: pCompanyName,
		$PositionTitle: pPositionTitle,
		$Url: pUrl,
		$Notes: pNotes,
		$ColCardPosition: pColCardPosition,
	});	
}

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

	cN = document.getElementById("CompanyName").value;
	pT = document.getElementById('PositionTitle').value;
	uR = document.getElementById('URL').value;
	nT = document.getElementById('Notes').value;
	
	updateDataBase(cN, pT, uR, nT, colCardPos);

	document.getElementById("CompanyName").value = "";
	document.getElementById('PositionTitle').value = "";
	document.getElementById('URL').value = "";
	document.getElementById('Notes').value = "";
}

function setColCardPos(s)
{
	colCardPos = s;
	moveTo = document.getElementById("MoveTo");
	moveTo.innerHTML = s;
}

createDataBaseonLoad()




