var colCardPos = "Pursuing";
var sqlite3 = require('sqlite3').verbose();
var colCardColor;
var retreiveInfoCompany; 
let db = new sqlite3.Database('./portfolios.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log(err.message);
  }
  else
  {
  	console.log('Connected to the Portfolios database.');	
  }  
});

$(function () 
{
	try{
		$('#colorPicker').colorpicker();

		$('#colorPicker').on('colorpickerChange', function(event) {
			colCardColor = event.color.toString();
		});
	}
	catch (err)
	{
		console.log(err);
	}
});


function createDataBaseonLoad()
{
	db.run('CREATE TABLE IF NOT EXISTS Portfolios(CompanyName TEXT PRIMARY KEY, PositionTitle TEXT, Url TEXT, Notes TEXT, ColCardPosition TEXT, Color TEXT, Date DATE)');
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
				createColCardsOnLoad(row.CompanyName, row.ColCardPosition, row.Color);
			}
		}
	});
}

function createColCardsOnLoad(CompanyName, colCardPosition, Color)
{
	var card = document.createElement("div");

	var button = document.createElement("button");
	

	button.innerHTML = CompanyName;
	button.classList.add("companyButton");
	button.classList.add("colCard");
	button.classList.add("btn");
	button.classList.add("btn-primary");
	card.appendChild(button);

	button.onclick = function ()
	{
		retreiveInfoCompany = button.innerHTML;
		retreiveData();
	};

	try{document.getElementById(colCardPosition).appendChild(card);}
	catch (err) {console.log(err);}

	button.style.backgroundColor = Color;
	button.style.borderColor = Color;
}

function updateDataBase(pCompanyName, pPositionTitle, pUrl, pNotes, pColCardPosition, pDate)
{
	db.run('INSERT INTO Portfolios (CompanyName, PositionTitle, Url, Notes, ColCardPosition, Color, Date) VALUES ($CompanyName, $PositionTitle, $Url, $Notes, $ColCardPosition, $Color, $Date)',
	{
		$CompanyName: pCompanyName,
		$PositionTitle: pPositionTitle,
		$Url: pUrl,
		$Notes: pNotes,
		$ColCardPosition: pColCardPosition,
		$Color: colCardColor,
		$Date: pDate
	});	
}

function createColCards()
{
	
	var card = document.createElement("div");

	var button = document.createElement("button");
	button.innerHTML = document.getElementById("CompanyName").value;
	button.classList.add("companyButton");
	button.classList.add("colCard");
	button.classList.add("btn");
	button.classList.add("btn-primary");
	card.appendChild(button);

	document.getElementById(colCardPos).appendChild(card);
	button.style.backgroundColor = colCardColor;
	button.style.borderColor = colCardColor;

	button.onclick = function ()
	{
		retreiveInfoCompany = button.innerHTML;
		retreiveData();
	};

	cN = document.getElementById("CompanyName").value;
	pT = document.getElementById("PositionTitle").value;
	uR = document.getElementById("URL").value;
	nT = document.getElementById("Notes").value;
	intD = document.getElementById("interviewDate").value;
	
	updateDataBase(cN, pT, uR, nT, colCardPos, intD);

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

createDataBaseonLoad();



function retreiveData() {

	var myWindow = window.open("./companyPortfolio.html");
	myWindow.name = 'dani';
}

















