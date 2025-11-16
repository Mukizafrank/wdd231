const MEMBERS_DATA_URL = 'data/members.json';

export async function loadMemberSpotlights() {
    try {
        const response = await fetch(MEMBERS_DATA_URL);
        if (!response.ok) {
            throw new Error('Members data not available');
        }
        
        const members = await response.json();
        displayRandomSpotlights(members);
    } catch (error) {
        console.error('Error loading member data:', error);
        displaySpotlightsError();
    }
}

function displayRandomSpotlights(members) {
    // Filter for gold and silver members only
    const eligibleMembers = members.filter(member => 
        member.membershipLevel === 'gold' || member.membershipLevel === 'silver'
    );
    
    // Randomly select 2-3 members
    const shuffled = [...eligibleMembers].sort(() => 0.5 - Math.random());
    const selectedMembers = shuffled.slice(0, Math.min(3, Math.floor(Math.random() * 2) + 2));
    
    const container = document.getElementById('spotlight-container');
    container.innerHTML = '';
    
    if (selectedMembers.length === 0) {
        container.innerHTML = '<p>No member spotlights available at this time.</p>';
        return;
    }
    
    selectedMembers.forEach(member => {
        const card = document.createElement('div');
        card.className = 'spotlight-card';
        card.innerHTML = `
            <img src="${member.image}" alt="${member.name} logo" class="spotlight-logo" loading="lazy">
            <h3>${member.name}</h3>
            <div class="membership-badge membership-${member.membershipLevel}">
                ${member.membershipLevel.charAt(0).toUpperCase() + member.membershipLevel.slice(1)} Member
            </div>
            <p class="member-phone">📞 ${member.phone}</p>
            <p class="member-address">📍 ${member.address}</p>
            <p class="member-website">
                <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
            </p>
        `;
        container.appendChild(card);
    });
}

function displaySpotlightsError() {
    const container = document.getElementById('spotlight-container');
    container.innerHTML = '<p>Member spotlights currently unavailable</p>';
}