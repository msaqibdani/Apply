function createColCards()
{
	var text = document.createElement("p");
	text.innerHTML = document.getElementById("CompanyName").value;
	text.classList.add("card-text");

	var cardBody = document.createElement("div");
	cardBody.classList.add("card-body");
	cardBody.classList.add("text-center");

	var cardHeader = document.createElement("div");
	cardHeader.classList.add("card");
	cardHeader.classList.add("bg-primary");

	var card = document.createElement("div");
	card.classList.add("colCard");

	cardBody.appendChild(text);
	cardHeader.appendChild(cardBody);
	card.appendChild(cardHeader);

	document.getElementById("colCards").appendChild(card);

	document.getElementById("CompanyName").value = "";
}