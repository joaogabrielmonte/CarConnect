let map, marker, userLocation;
let directionsService, directionsRenderer;
const baseRate = 5.0; // Taxa base em R$
const perKmRate = 2.5; // Taxa por km em R$

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: -23.5505, lng: -46.6333 } // São Paulo como ponto inicial
    });

    directionsRenderer.setMap(map);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);

                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "Sua localização"
                });

                // Atualiza a posição no campo de destino
                document.getElementById('destination').value = `${userLocation.lat}, ${userLocation.lng}`;
            },
            (error) => {
                console.error("Erro ao obter localização:", error);
                alert("Não foi possível obter sua localização. Erro: " + error.message);
            }, {
                enableHighAccuracy: true,  // Tenta melhorar a precisão
                timeout: 10000,           // 10 segundos de tempo de espera
                maximumAge: 0             // Não usa localização cacheada
            }
        );
    } else {
        alert("Geolocalização não é suportada pelo seu navegador.");
    }

    // Adiciona um evento de clique no mapa para definir o destino
    map.addListener('click', (event) => {
        if (marker) marker.setMap(null);

        marker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            title: "Destino"
        });

        document.getElementById('destination').value = `${event.latLng.lat()}, ${event.latLng.lng()}`;
    });
}

function calculateRoute() {
    const destinationInput = document.getElementById('destination').value;
    const passengerType = document.getElementById('passenger-type').value;

    if (!userLocation) {
        alert("Localização atual não disponível.");
        return;
    }

    let destination;
    if (destinationInput.includes(',')) {
        const coords = destinationInput.split(',');
        destination = {
            lat: parseFloat(coords[0]),
            lng: parseFloat(coords[1])
        };
    } else {
        alert("Destino inválido.");
        return;
    }

    const request = {
        origin: userLocation,
        destination: destination,
        travelMode: 'DRIVING'
    };

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);

            const distance = result.routes[0].legs[0].distance.value / 1000; // em km
            const duration = result.routes[0].legs[0].duration.text;
            
            // Calcula o preço estimado
            const estimatedPrice = (baseRate + (distance * perKmRate)).toFixed(2);

            document.getElementById('info').innerHTML = `
                <p><strong>Tipo de Passageiro:</strong> ${passengerType}</p>
                <p><strong>Distância:</strong> ${distance.toFixed(2)} km</p>
                <p><strong>Tempo estimado:</strong> ${duration}</p>
                <p><strong>Preço estimado:</strong> R$ ${estimatedPrice}</p>
            `;
            document.getElementById('request-ride').style.display = 'inline-block';
        } else {
            alert("Não foi possível calcular a rota.");
        }
    });
}

function requestRide() {
    const destinationInput = document.getElementById('destination').value;
    const passengerType = document.getElementById('passenger-type').value;

    if (!userLocation) {
        alert("Localização atual não disponível.");
        return;
    }

    let destination;
    if (destinationInput.includes(',')) {
        const coords = destinationInput.split(',');
        destination = {
            lat: parseFloat(coords[0]),
            lng: parseFloat(coords[1])
        };
    } else {
        alert("Destino inválido.");
        return;
    }

    const request = {
        origin: userLocation,
        destination: destination,
        travelMode: 'DRIVING'
    };

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);

            const distance = result.routes[0].legs[0].distance.value / 1000; // em km
            const duration = result.routes[0].legs[0].duration.text;
            
            // Calcula o preço estimado
            const estimatedPrice = (baseRate + (distance * perKmRate)).toFixed(2);

            // Armazena os dados na sessionStorage
            sessionStorage.setItem('destination', destinationInput);
            sessionStorage.setItem('passengerType', passengerType);
            sessionStorage.setItem('distance', distance);
            sessionStorage.setItem('estimatedPrice', estimatedPrice);

            document.getElementById('info').innerHTML = `
                <p><strong>Tipo de Passageiro:</strong> ${passengerType}</p>
                <p><strong>Distância:</strong> ${distance.toFixed(2)} km</p>
                <p><strong>Tempo estimado:</strong> ${duration}</p>
                <p><strong>Preço estimado:</strong> R$ ${estimatedPrice}</p>
            `;
            document.getElementById('request-ride').style.display = 'inline-block';

            // Redireciona para a página de confirmação
            window.location.href = 'corrida_confirmada.html';  // Verifique se o caminho está correto
        } else {
            alert("Não foi possível calcular a rota.");
        }
    });
}


function openLogin() {
    document.getElementById('login-modal').style.display = 'flex';
}

function closeLogin() {
    document.getElementById('login-modal').style.display = 'none';
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        alert(`Bem-vindo, ${username}!`);
        closeLogin();
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}
