var colCardPos = "Pursuing";
var sqlite3 = require('sqlite3').verbose();
var colCardColor;
var retreiveInfoCompany; 
var removeCurrCompany;
var showName; 
var showTitle;
var showURL;
var showNotes;
var showDate;
var showColor;

let db = new sqlite3.Database('./portfolios.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log(err.message);
  }
  else
  {
  	console.log('Connected to the Portfolios database.');	
  }  
});
var Chart = require('./node_modules/chart.js');

var stats = {'Total':0, 'Pursuing':0, 'Applied':0, 'Interview':0, 'Decision':0};

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


/* Creates a table if it doesn't exists and runs developOnLoad()
*/
function createDataBaseonLoad()
{
	db.run('CREATE TABLE IF NOT EXISTS Portfolios(CompanyName TEXT PRIMARY KEY, PositionTitle TEXT, Url TEXT, Notes TEXT, ColCardPosition TEXT, Color TEXT, Date DATE)');
	db.run('CREATE TABLE IF NOT EXISTS ToDo(Item TEXT PRIMARY KEY)');
	developOnLoad();

}

/*	Runs through database and calls for createColCardsonLoad()
*/
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
			if (row != null && row.CompanyName != '')
			{
				stats['Total'] += 1;
				stats[row.ColCardPosition] += 1;
				createColCardsOnLoad(row.CompanyName, row.ColCardPosition, row.Color);
			}
		}
	});
}

/*	It is called on load for each element in database to develop the company Card */
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
		removeCurrCompany = button.innerHTML;
		findCompany(button.innerHTML);
		showPortal();
	};

	card.id = button.innerHTML;


	try{document.getElementById(colCardPosition).appendChild(card);}
	catch (err) {console.log(err);}

	button.style.backgroundColor = Color;
	button.style.borderColor = Color;
}

/*	It is called by createColCards and to add company information to database
*/
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

/*	Create company cards in the coloumns and calls updateDataBase
*/
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

	if (button.innerHTML == "")
	{
		return;
	}

	document.getElementById(colCardPos).appendChild(card);
	stats['Total'] += 1;
	stats[colCardPos] += 1;
	button.style.backgroundColor = colCardColor;
	button.style.borderColor = colCardColor;

	button.onclick = function ()
	{
		
		removeCurrCompany = button.innerHTML;
		findCompany(button.innerHTML);
		showPortal();
	};

	card.id = button.innerHTML;

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

/*	Sets current Company position while making company card 
	for the first time
*/
function setColCardPos(s)
{
	colCardPos = s;
	moveTo = document.getElementById("MoveTo");
	moveTo.innerHTML = s;
}

createDataBaseonLoad(); //If there's anything in the database develop those cards


/*	Updates the variables whenever a company card is clicked
	It is called during onclick event while creating company cards
*/
function findCompany(x)
{
	db.each('SELECT * FROM Portfolios', (error, row) =>
		{
			console.log('in')
			if (error)
			{
				throw error;
			}
			else
			{
				if (row != null && row.CompanyName == x)
				{
					showName = row.CompanyName;
					showTitle = row.PositionTitle;
					showURL = row.Url;
					showNotes = row.Notes;
					showDate = row.Date;
					showColor = row.Color;
				}
			}
		});
}

function showPortal()
{

	$('#myModal1').modal('toggle');
}

/* Shows companyPortfolio and calls changeColors
*/
function showCompanyPortfolio()
{
	document.getElementById('showCompanyName').innerHTML = showName;
	document.getElementById('showCompanyTitle').innerHTML = showTitle;
	document.getElementById('showCompanyURL').innerHTML = showURL;
	document.getElementById('showCompanyNotes').innerHTML = showNotes;
	document.getElementById('showCompanyInterviewDate').innerHTML = showDate;
	changeColors(showColor);
}

/* 	When a company is moved from one coloumn to another
	this function updates databases and the coloumns
*/
function moveToNew(place)
{
	db.get('SELECT * FROM Portfolios WHERE CompanyName =?', removeCurrCompany, (err, row) => {
		stats[row.ColCardPosition]-=1;
	});

	db.run('UPDATE Portfolios SET ColCardPosition = ? WHERE CompanyName = ?',[place, removeCurrCompany], function(err)
		{
			if (err) {
				console.log(err);
			}
		});

	document.getElementById(removeCurrCompany).remove();

	db.get('SELECT * FROM Portfolios WHERE CompanyName =?', removeCurrCompany, (err, row) => {
		stats[row.ColCardPosition]+=1;
		createColCardsOnLoad(row.CompanyName, row.ColCardPosition, row.Color)
		});
}

/*	Changes the color of the showCompanyPortfolio Modal
	when company is shown
*/

function changeColors(x)
{	
	if (x == null)
	{
		return;
	}
	document.getElementById('showCompanyPortfolioHeader').style.backgroundColor = showColor;
	document.getElementById('showCompanyPortfolioHeader').style.color = 'white';

	document.getElementById('showCompanyPortfolioBody').style.backgroundColor = showColor;

	document.getElementById('cardTitle').style.backgroundColor = showColor;
	document.getElementById('cardTitle').style.color = 'white';

	document.getElementById('cardURL').style.backgroundColor = showColor;
	document.getElementById('cardURL').style.color = 'white';

	document.getElementById('cardNotes').style.backgroundColor = showColor;
	document.getElementById('cardNotes').style.color = 'white';

	document.getElementById('cardInterviewDate').style.backgroundColor = showColor;
	document.getElementById('cardInterviewDate').style.color = 'white';
}

/*	Resets the entire showCompanyPortfolio Modal
	It is called by removeCompany as well as by the close button
	of the Portfolio Modal
*/
function resetModal()
{

	document.getElementById('showCompanyPortfolioHeader').style.backgroundColor = 'white';
	document.getElementById('showCompanyPortfolioHeader').style.color = '';

	document.getElementById('showCompanyPortfolioBody').style.backgroundColor = 'white';

	document.getElementById('showCompanyPortfolioFooter').style.backgroundColor = 'white';

	document.getElementById('cardTitle').style.backgroundColor = 'white';
	document.getElementById('cardTitle').style.color = '';

	document.getElementById('cardURL').style.backgroundColor = 'white';
	document.getElementById('cardURL').style.color = '';

	document.getElementById('cardNotes').style.backgroundColor = 'white';
	document.getElementById('cardNotes').style.color = '';

	document.getElementById('cardInterviewDate').style.backgroundColor = 'white';
	document.getElementById('cardInterviewDate').style.color = '';
	

	document.getElementById('showCompanyName').innerHTML = 'Company Portal';
	document.getElementById('showCompanyTitle').innerHTML = '';
	document.getElementById('showCompanyURL').innerHTML = '';
	document.getElementById('showCompanyNotes').innerHTML = '';
	document.getElementById('showCompanyInterviewDate').innerHTML = '';
}

/*	Removes the company from the database
	It is called by 
*/
function removeCompany()
{
	document.getElementById(removeCurrCompany).remove();

		db.get('SELECT * FROM Portfolios WHERE CompanyName =? ', removeCurrCompany, (err, row) => {
			stats[row.ColCardPosition] -= 1;
			stats['Total'] -= 1;
		})

		db.run('DELETE FROM Portfolios WHERE CompanyName = ?',removeCurrCompany, function(err)
		{
			if (err) {
				console.log(err);
			}

		
		});

	resetModal();
}

/*Createss Line Chart*/
function createLineChart()
{

	var arr = [stats['Pursuing'], stats['Applied'], stats['Interview'], stats['Decision'], 0]
	var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {

		type: 'line',

    
	    data: {
	    	labels: ['Pursuing', 'Applied', 'Interview', 'Decision'],
	        datasets: [{
	            backgroundColor: 'white',
	            borderColor: 'red',
	            data: arr,
	            fill: false
	        }]
	    },

	    options: {

	    	legend: {
	    		display: false
	    	},
	    	scales: {
				yAxes: 
				[{
					stacked: false,
					gridLines: 
					{
			        	display: false,
			    	 }
			    }],
			    xAxes: 
			    [{
			      gridLines: {
			        display: false
			      }
			    }]
			}

	    }
	    
	});
}

/*Createss Bar Chart*/
function createBarChart()
{
	var arr = [stats['Pursuing'], stats['Applied'], stats['Interview'], stats['Decision']]
	var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {

		type: 'doughnut',

    
	    data: {
	    	labels: ['Pursuing', 'Applied', 'Interview', 'Decision'],
	        datasets: [{
	            backgroundColor: ['#8775C2', '#4E90C1', '#DC726A', '#7CC05A'],
	            borderColor: 'white',
	            data: arr
	        }]
	    }
	    
	});
}

/*	Updates the Database by adding new ToDo Item
	It is used by Company Portfolio Modal
*/
function addToDoItem()
{	
	var item = document.getElementById('ToDoInput').value;

	db.run('INSERT INTO ToDo (Item) VALUES ($Item)',
	{
		$Item: item
	});	

	document.getElementById('ToDoInput').value = '';
}

/*	Updates the Database by adding new ToDo Item
	It is used by Add ToDo seperate funcion
*/
function addToDo()
{	
	var item = document.getElementById('ToDoInput1').value;

	db.run('INSERT INTO ToDo (Item) VALUES ($Item)',
	{
		$Item: item
	});	

	document.getElementById('ToDoInput1').value = '';
}

/*	Called by Show Button in ToDoModal
	Runs through each element in ToDo Database 
	and calls newElement(row.Item)
*/
function showToDoList()
{

	db.each('SELECT * FROM ToDo', (error, row) =>
		{
			if (error)
			{
				throw error;
			}
			else
			{
				if (row != null && row.Item != '')
				{
					newElement(row.Item);
				}
			}
		});
}

/* Adds a new element to the list Item
   It is called in showToDoList()
   Called when users wants to see the list
*/
function newElement(text) 
{
	var li = document.createElement("li");
	li.classList.add("unchecked");
	li.onclick = function ()
	{
		li.classList.remove("unchecked");
		li.classList.add("checked");
		removeItemList(text);
	}

	li.innerHTML = text;
	document.getElementById("ToDoBody").appendChild(li);
	document.getElementById("myInput").value = "";	
}

/*	Resets the entire ToDoModal body (avoid over repeating)
	It is called by Close Button in the ToDoModal footer
*/
function resetToDoList()
{
	node = document.getElementById("ToDoBody");
	while (node.firstChild) 
	{
		node.removeChild(node.firstChild);
	}
}

/*	When a ToDo Item is clicked -> removeItemList is called which
	removes the item from the database
*/
function removeItemList(text)
{
	db.run('DELETE FROM ToDo WHERE Item = ?',text, function(err)
		{
			if (err) {
				console.log(err);
			}

		});
}




