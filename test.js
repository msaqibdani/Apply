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


function createDataBaseonLoad()
{
	db.run('CREATE TABLE IF NOT EXISTS Portfolios(CompanyName TEXT PRIMARY KEY, PositionTitle TEXT, Url TEXT, Notes TEXT, ColCardPosition TEXT, Color TEXT, Date DATE)');
	db.run('CREATE TABLE IF NOT EXISTS ToDo(Item TEXT PRIMARY KEY)');
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
			if (row != null && row.CompanyName != '')
			{
				stats['Total'] += 1;
				stats[row.ColCardPosition] += 1;
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

function setColCardPos(s)
{
	colCardPos = s;
	moveTo = document.getElementById("MoveTo");
	moveTo.innerHTML = s;
}

createDataBaseonLoad();


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

function showCompanyPortfolio()
{
	document.getElementById('showCompanyName').innerHTML = showName;
	document.getElementById('showCompanyTitle').innerHTML = showTitle;
	document.getElementById('showCompanyURL').innerHTML = showURL;
	document.getElementById('showCompanyNotes').innerHTML = showNotes;
	document.getElementById('showCompanyInterviewDate').innerHTML = showDate;
	changeColors(showColor);
}

function changeColors(x)
{	
	if (x == null)
	{
		return;
	}
	document.getElementById('showCompanyPortfolioHeader').style.backgroundColor = showColor;
	document.getElementById('showCompanyPortfolioHeader').style.color = 'white';
	document.getElementById('showCompanyPortfolioBody').style.backgroundColor = showColor;
}

function resetModal()
{

	document.getElementById('showCompanyPortfolioHeader').style.backgroundColor = 'white';
	document.getElementById('showCompanyPortfolioBody').style.backgroundColor = 'white';

	document.getElementById('showCompanyName').innerHTML = 'Company Portal';
	document.getElementById('showCompanyTitle').innerHTML = '';
	document.getElementById('showCompanyURL').innerHTML = '';
	document.getElementById('showCompanyNotes').innerHTML = '';
	document.getElementById('showCompanyInterviewDate').innerHTML = '';
}

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
}

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

function addToDoItem()
{	
	var item = document.getElementById('ToDoInput').value;
	console.log(item);

	db.run('INSERT INTO ToDo (Item) VALUES ($Item)',
	{
		$Item: item
	});	

	document.getElementById('ToDoInput').value = '';

}

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

function resetToDoList()
{
	node = document.getElementById("ToDoBody");
	while (node.firstChild) 
	{
		node.removeChild(node.firstChild);
	}
}

function removeItemList(text)
{
	db.run('DELETE FROM ToDo WHERE Item = ?',text, function(err)
		{
			if (err) {
				console.log(err);
			}

		});
}




