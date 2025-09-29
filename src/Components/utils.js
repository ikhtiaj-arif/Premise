//  const URL = "https://mynextfilm.ai";
//  const baseURL = "https://mynextfilm.ai";
//  const URL = "http://115.245.192.138";
//  const baseURL = "http://115.245.192.138";
// const URL = "http://1.6.141.104:4000";
// const baseURL = "http://1.6.141.104:4000";
// const URL = "http://localhost:8001";
// const baseURL = "http://localhost:8001";


// const URL = `https://app.mnf.ai`;
// const baseURL = `https://app.mnf.ai`;

const URL = window.location.origin;
const baseURL = window.location.origin;

// const URL = "http://1.6.141.108";
// const baseURL = "http://1.6.141.108";

// const URL = "https://taj4o.mynextfilm.in";
// const baseURL = "https://taj4o.mynextfilm.in";

//  const URL = "https://qa.mynextfilm.net";
//  const baseURL = "https://qa.mynextfilm.net";


const NProjectOpt = [
    {
      value: "Short film",
      hi: "शॉर्ट फिल्म",
    },
    {
      value: "Feature film",
      hi: "फीचर फिल्म",
    },
  ];
    const options1 = {
    "Short film": [
      // { text: "About 2 Minutes", value: "Upto 2 Minutes" },
      { text: "About 5 Minutes", value: "2 to 4 Minutes" },
      { text: "About 15 Minutes", value: "5 to 14 Minutes" },
      { text: "About 25 Minutes", value: "15 to 29 Minutes" },
      { text: "About 30 Minutes", value: "30 Minutes" },
    ],
    "Feature film": [
      { text: "About 1 Hour", value: "1 Hour" },
      { text: "About 2 Hours", value: "2 Hours" },
      { text: "About 3 Hours", value: "3 Hours" },
    ],
  };
const Natureoptions  = {
    "Short film": [
      // { text: "About 2 Minutes", value: "Upto 2 Minutes", hi: "लगभग 2 मिनट" },
      { text: "About 5 Minutes", value: "2 to 4 Minutes", hi: "लगभग 5 मिनट" },
      {
        text: "About 15 Minutes",
        value: "5 to 14 Minutes",
        hi: "लगभग 15 मिनट",
      },
      {
        text: "About 25 Minutes",
        value: "15 to 29 Minutes",
        hi: "लगभग 25 मिनट",
      },
      { text: "About 30 Minutes", value: "30 Minutes", hi: "लगभग 30 मिनट" },
    ],
    "Feature film": [
      { text: "About 1 Hour", value: "1 Hour", hi: "लगभग 1 घंटा" },
      { text: "About 2 Hours", value: "2 Hours", hi: "लगभग 2 घंटे" },
      { text: "About 3 Hours", value: "3 Hours", hi: "लगभग 3 घंटे" },
    ],
  };

  const genera = [
    "Thriller",
    "Horror",
    "Drama",
    "Action",
    "Mystery",
    "Documentary",
    "Romantic",
    "Adventure",
    "Superhero",
    "Comedy",
    "Crime",
    "Fantasy",
    "Science_fiction",
    "Other",
  ];

  const subGenraItems = {
      Thriller: [
        "Action Thriller",
        "Crime Thriller",
        "Legal thriller",
        "Mystery Thriller",
        "Romantic Thriller",
        "Science fiction Thriller",
        "Political Thriller",
        "Spy Thriller",
        "Psychological Thriller",
        "Conspiracy Thriller",
      ],
      Horror: [
        "B-Movie",
        "Found footage",
        "Monster",
        "Paranormal film",
        "Slasher",
        "Vampire",
        "Zombie",
        "Folk Horror",
        "Psychological Horror",
        "Horror Comedy",
      ],
      Drama: [
        "Biopic",
        "Coming of age drama",
        "Costume drama",
        "Crime drama",
        "Romantic drama",
        "Tragedy",
        "War movie",
        "Legal Drama",
        "Family Drama",
        "Teen Drama",
      ],
      Action: [
        "Superhero",
        "Martial arts",
        "Action Comedy",
        "Military/War Action",
        "Spy",
        "Heist Action",
        "Supernatural Action",
      ],
      Mystery: [
        "Superhero",
        "Martial arts",
        "Action Comedy",
        "Cozy Mystery",
        "Noir",
        "Psychological Mystery",
        "Detective Procedural",
        "Paranormal Mystery",
      ],
      Documentary: [
        "True Crime",
        "Biographical",
        "Social Issue",
        "Nature",
        "Tech/Startup",
      ],
      Romantic: [
        "Romantic Comedy",
        "Chick flick",
        "Historical romance",
        "Gothic romance",
        "Period Romance",
        "Teen Romance",
        "Love Triangle",
      ],
  
      Adventure: [
        "Survival Adventure",
        "Historical Adventure",
        "Fantasy Adventure",
        "Expedition/Quest",
        "Swashbuckling",
      ],
  
      Superhero: [
        "Classic Superhero",
        "Anti-Hero",
        "Teen Superhero",
        "Superhero Comedy",
        "Dark/Realistic ",
      ],
      Comedy: [
        "Black Comedy",
        "Buddy Comedy",
        "Comedic Thriller",
        "Farce",
        "Mockumentary",
        "Musical Comedy",
        "Parody",
        "Slapstick",
        "Sports Comedy",
        "Romantic Comedy",
        "Workplace Comedy",
      ],
      Crime: [
        "Film noir",
        "Neo-noir",
        "Mafia",
        "Military Thriller",
        "Psychological Thriller",
      ],
  
      Fantasy: [
        "Dark fantasy",
        "Epic fantasy",
        "Low fantasy",
        "Magical realism",
        "Fables",
        "Fairy tales",
        "Superhero fiction",
      ],
  
      Science_fiction: [
        "Cyberpunk",
        "Disaster",
        "Dystopian",
        "Fairy tale",
        "Fantasy",
        "Space opera",
        "Time travel",
      ],
  
      Other: ["", ""],
    };


export { baseURL, genera, Natureoptions, NProjectOpt, subGenraItems, URL };

