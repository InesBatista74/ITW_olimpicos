const details = {
    1896: "The first modern Olympics took place in Athens, Greece. Organized by Pierre de Coubertin, they marked the rebirth of the Olympics, with 13 participating countries and 43 events.",
    1900: "The 1900 Olympic Games, held in Paris, were marked by their integration with the World’s Fair, the lack of official ceremonies, and disorganized events, but they introduced female participation and new sports to the Olympic program.",
    1936: "Famous for its use as political propaganda by Adolf Hitler's Nazi regime, these Games also marked the victory of African-American athlete Jesse Owens, who defied Nazi racial ideology by winning 4 gold medals.",
    1940: "The 1940 Olympics, initially scheduled for Tokyo, and the 1944 Olympics, scheduled for London, were canceled due to World War II.",
    1960: "The 1960 Games were notable for their historic milestones, including the first live television broadcast of the event and the triumph of Ethiopian runner Bikila, who won the marathon barefoot, becoming the first African to win Olympic gold.",
    1968: "The 1968 Olympics were marked by the silent protest of Tommie Smith and John Carlos, who raised their black-gloved fists during the awards ceremony, as a protest against racial discrimination in the United States.",
    1984: "The 1984 edition was notable for its great financial success, marking a model for private organization of the Games. The Soviet Union and other Warsaw Pact countries boycotted the Games.",
    2008: "The Beijing Olympics were a huge success, with an impressive opening ceremony led by Zhang Yimou and China excelling in the medals. They also marked the inclusion of the sport of swimming, with Michael Phelps winning 8 gold medals.",
    2021: "Originally scheduled for 2020, the Tokyo Olympics were postponed to 2021 due to the COVID-19 pandemic, with the first Olympic Games to be postponed in times of peace. The competition took place without an audience, due to health restrictions.",
    2024: "Check it all out right here in this website, from the athletes, to the referees, the coaches, check out the olympic flame relay, the olumpic venues and much more"
};

function showDetails(element, year) {
    const timeline = document.querySelector('.timeline');
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach(balloon => balloon.remove());

    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.innerHTML = `<h4>${year}</h4><p>${details[year]}</p>`;
    
    timeline.appendChild(balloon);
    const rect = element.getBoundingClientRect();
    const timelineRect = timeline.getBoundingClientRect();
    
    // A posição da caixa de texto agora está ajustada para aparecer acima da linha do tempo
    balloon.style.left = `${rect.left - timelineRect.left - 230}px`;  // Ajustar a posição horizontal
    balloon.style.top = `${rect.top - timelineRect.top - 180}px`;  // Ajustar para aparecer acima
    balloon.style.display = 'block';
}



