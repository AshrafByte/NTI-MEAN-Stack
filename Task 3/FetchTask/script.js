let url = 'https://jsonplaceholder.typicode.com/posts';
let cards = document.createElement('div');
cards.className = 'cards';
document.body.appendChild(cards);


function buildCard(instance) {
    let card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h2>${instance.id}</h2>
        <h3>${instance.title}</h3>
        <p>${instance.body}</p>
    `;
    cards.appendChild(card);
}

function createCardByID(id) {
    let url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(buildCard);
}

////////////////////////////////////////////////////////

function createCards(numOfCards) {
    for (let i = 1; i <= numOfCards; i++)
       createCardByID(i);
}

function postData(data) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(() => buildCard(data))
        .catch(error => console.error('Error posting card:', error));
}

createCards(10);
postData({
    id: 100,
    title: 'Test post',
    body: 'This is a sample post body.'
});
