
//Em: written according to this given API documentation -- https://fsa-crud-2aa9294fe819.herokuapp.com/api/#tag/API-Usage
//2504-FTB-ET-WEB-PT

const API_BASE_URL = https://fsa-crud-2aa9294fe819.herokuapp.com/api/2504-FTB-ET-WEB-PT;

let state = {
    parties: [],
    selectedParty: null,
    guests: [],
    rsvps: [],
    loading: false,
    error: null
  };

  async function fetchParties() {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch events');
      }
      return data.data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }
  
  async function fetchParty(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch event: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch event');
      }
      return data.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }
  
  async function fetchGuests() {
    try {
      const response = await fetch(`${API_BASE_URL}/guests`);
      if (!response.ok) {
        throw new Error(`Failed to fetch guests: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch guests');
      }
      return data.data || [];
    } catch (error) {
      console.error('Error fetching guests:', error);
      throw error;
    }
  }
  
  async function fetchRSVPs() {
    try {
      const response = await fetch(`${API_BASE_URL}/rsvps`);
      if (!response.ok) {
        throw new Error(`Failed to fetch RSVPs: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch RSVPs');
      }
      return data.data || [];
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
      throw error;
    }
  }

  function updateState(newState) {
    state = { ...state, ...newState };
    render();
  }
  
  function setLoading(loading) {
    updateState({ loading });
  }
  
  function setError(error) {
    updateState({ error: error.message });
  }
  
  function clearError() {
    updateState({ error: null });
  }

  async function loadParties() {
    try {
      setLoading(true);
      clearError();
      const events = await fetchParties();
      updateState({ parties: events, loading: false });
    } catch (error) {
      setError(error);
      updateState({ loading: false });
    }
  }
  
  async function loadPartyDetails(partyId) {
    try {
      setLoading(true);
      clearError();
      const event = await fetchParty(partyId);
      updateState({ selectedParty: event, loading: false });
    } catch (error) {
      setError(error);
      updateState({ loading: false });
    }
  }
  
  async function loadGuestsAndRSVPs() {
    try {
      const [guests, rsvps] = await Promise.all([
        fetchGuests(),
        fetchRSVPs()
      ]);
      updateState({ guests, rsvps });
    } catch (error) {
      setError(error);
    }
  }
  
  // Event Handlers
  async function handlePartyClick(partyId) {
    try {
      await loadPartyDetails(partyId);
    } catch (error) {
      setError(error);
    }
  }
  
  // Utility Functions
  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }
  
  function getPartyGuests(partyId) {
    const partyRSVPs = state.rsvps.filter(rsvp => rsvp.eventId === partyId);
    const guestIds = partyRSVPs.map(rsvp => rsvp.guestId);
    return state.guests.filter(guest => guestIds.includes(guest.id));
  }
  
  // Component Functions
  function createPartyListItem(party) {
    const li = document.createElement('li');
    li.className = 'party-item';
    
    if (state.selectedParty && state.selectedParty.id === party.id) {
      li.classList.add('selected');
    }
    
    li.textContent = party.name;
    li.addEventListener('click', () => handlePartyClick(party.id));
    
    return li;
  }
  
  function createPartyList() {
    const container = document.createElement('div');
    container.className = 'party-list-container';
    
    const title = document.createElement('h2');
    title.textContent = 'Event List';
    container.appendChild(title);
    
    if (state.parties.length === 0) {
      const message = document.createElement('p');
      message.textContent = 'No events available';
      message.className = 'no-parties-message';
      container.appendChild(message);
      return container;
    }
    
    const ul = document.createElement('ul');
    ul.className = 'party-list';
    
    state.parties.forEach(party => {
      const listItem = createPartyListItem(party);
      ul.appendChild(listItem);
    });
    
    container.appendChild(ul);
    return container;
  }
  
  function createGuestList(guests) {
    const container = document.createElement('div');
    container.className = 'guest-list-container';
    
    const title = document.createElement('h3');
    title.textContent = 'RSVP\'d Guests';
    container.appendChild(title);
    
    if (guests.length === 0) {
      const message = document.createElement('p');
      message.textContent = 'No guests have RSVP\'d yet';
      message.className = 'no-guests-message';
      container.appendChild(message);
      return container;
    }
    
    const guestCards = document.createElement('div');
    guestCards.className = 'guest-cards';
    
    guests.forEach(guest => {
      const card = document.createElement('div');
      card.className = 'guest-card';
      
      const name = document.createElement('h4');
      name.textContent = guest.name;
      name.className = 'guest-name';
      card.appendChild(name);
      
      if (guest.job) {
        const job = document.createElement('p');
        job.textContent = guest.job;
        job.className = 'guest-job';
        card.appendChild(job);
      }
      
      if (guest.email) {
        const email = document.createElement('p');
        email.textContent = guest.email;
        email.className = 'guest-email';
        card.appendChild(email);
      }
      
      if (guest.phone) {
        const phone = document.createElement('p');
        phone.textContent = guest.phone;
        phone.className = 'guest-phone';
        card.appendChild(phone);
      }
      
      if (guest.bio) {
        const bio = document.createElement('p');
        bio.textContent = guest.bio;
        bio.className = 'guest-bio';
        card.appendChild(bio);
      }
      
      guestCards.appendChild(card);
    });
    
    container.appendChild(guestCards);
    return container;
  }
  
  function createPartyDetails() {
    const container = document.createElement('div');
    container.className = 'party-details-container';
    
    const title = document.createElement('h2');
    title.textContent = 'Event Details';
    container.appendChild(title);
    
    if (!state.selectedParty) {
      const message = document.createElement('p');
      message.textContent = 'Please select an event to view details';
      message.className = 'select-party-message';
      container.appendChild(message);
      return container;
    }
    
    const party = state.selectedParty;
    
    const details = document.createElement('div');
    details.className = 'party-details';
    
    const name = document.createElement('h3');
    name.textContent = party.name;
    details.appendChild(name);
    
    const id = document.createElement('p');
    id.innerHTML = `<strong>ID:</strong> ${party.id}`;
    details.appendChild(id);
    
    const date = document.createElement('p');
    date.innerHTML = `<strong>Date:</strong> ${formatDate(party.date)}`;
    details.appendChild(date);
    
    const description = document.createElement('p');
    description.innerHTML = `<strong>Description:</strong> ${party.description || 'No description available'}`;
    details.appendChild(description);
    
    const location = document.createElement('p');
    location.innerHTML = `<strong>Location:</strong> ${party.location || 'No location specified'}`;
    details.appendChild(location);
    
    container.appendChild(details);
    
    const partyGuests = getPartyGuests(party.id);
    const guestList = createGuestList(partyGuests);
    container.appendChild(guestList);
    
    return container;
  }
  
  function createLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.textContent = 'Loading...';
    return spinner;
  }
  
  function createErrorMessage() {
    const container = document.createElement('div');
    container.className = 'error-container';
    
    const message = document.createElement('p');
    message.className = 'error-message';
    message.textContent = `Error: ${state.error}`;
    container.appendChild(message);
    
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Retry';
    retryButton.className = 'retry-button';
    retryButton.addEventListener('click', loadParties);
    container.appendChild(retryButton);
    
    return container;
  }
  
  function createHeader() {
    const header = document.createElement('header');
    header.className = 'app-header';
    
    const title = document.createElement('h1');
    title.textContent = 'Fullstack Convention Center';
    header.appendChild(title);
    
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Event Management System';
    subtitle.className = 'app-subtitle';
    header.appendChild(subtitle);
    
    return header;
  }
  
  function createMainContent() {
    const main = document.createElement('main');
    main.className = 'main-content';
    
    const leftPanel = document.createElement('div');
    leftPanel.className = 'left-panel';
    leftPanel.appendChild(createPartyList());
    
    const rightPanel = document.createElement('div');
    rightPanel.className = 'right-panel';
    rightPanel.appendChild(createPartyDetails());
    
    main.appendChild(leftPanel);
    main.appendChild(rightPanel);
    
    return main;
  }
  
  function render() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    
    app.appendChild(createHeader());
    
    if (state.loading) {
      app.appendChild(createLoadingSpinner());
      return;
    }
    
    if (state.error) {
      app.appendChild(createErrorMessage());
      return;
    }
    
    app.appendChild(createMainContent());
  }
  
  async function init() {
    try {
      await loadParties();
      await loadGuestsAndRSVPs();
    } catch (error) {
      console.error('Failed to initialize application:', error);
      setError(error);
    }
  }
  
  document.addEventListener('DOMContentLoaded', init);

