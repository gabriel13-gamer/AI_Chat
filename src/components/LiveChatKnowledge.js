// Enhanced knowledge base for LiveChat AI responses
export const getSmartResponse = (userInput) => {
  const input = userInput.toLowerCase()
  
  // Greetings
  if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
    const greetings = [
      "Hello! It's great to hear from you. How are you doing today?",
      "Hi there! I'm excited to chat with you. What's on your mind?",
      "Hey! Nice to meet you. How can I help you today?",
      "Hello! I'm here and ready to chat. What would you like to talk about?"
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }
  
  // Enhanced knowledge base for "who is" questions
  if (input.includes('who is') || input.includes('who\'s') || input.includes('tell me who') || input.includes('do you know who')) {
    let subject = input.replace(/.*(?:who is|who's|tell me who|do you know who)\s+/, '').replace(/\?/g, '').trim()
    
    // Superheroes and Comic Characters
    if (subject.includes('flash')) {
      return "The Flash is a DC Comics superhero known for super speed! The most famous Flash is Barry Allen, a forensic scientist who gained his powers from a lightning strike and chemical accident. He can run faster than light, travel through time, and vibrate through solid objects. There's also Wally West, who was Kid Flash and later became the Flash. The Flash is a founding member of the Justice League!"
    }
    
    if (subject.includes('superman')) {
      return "Superman is one of the most iconic superheroes! His real name is Clark Kent, and he's actually Kal-El from the planet Krypton. He was sent to Earth as a baby and raised by Martha and Jonathan Kent in Smallville. He has incredible powers like super strength, flight, heat vision, x-ray vision, and invulnerability. He works as a reporter at the Daily Planet and protects Metropolis!"
    }
    
    if (subject.includes('batman')) {
      return "Batman is Bruce Wayne, a billionaire who witnessed his parents' murder as a child in Gotham City. He trained himself to become the ultimate detective and fighter, using his wealth to create advanced technology and gadgets. Unlike most superheroes, he has no superpowers - just incredible skill, intelligence, and determination. He's known as the Dark Knight and World's Greatest Detective!"
    }
    
    if (subject.includes('spider-man') || subject.includes('spiderman')) {
      return "Spider-Man is Peter Parker, a teenager who was bitten by a radioactive spider and gained spider-like powers! He can stick to walls, has super strength and agility, spider-sense that warns him of danger, and can shoot webs. He lives by the motto 'With great power comes great responsibility' after his Uncle Ben was killed. He protects New York City!"
    }
    
    if (subject.includes('wonder woman')) {
      return "Wonder Woman is Princess Diana of Themyscira, an Amazon warrior from a hidden island of warrior women. She's the daughter of Queen Hippolyta and has incredible strength, speed, and fighting skills. She wields the Lasso of Truth, indestructible bracelets, and sometimes a sword and shield. She represents truth, justice, and compassion!"
    }
    
    // Musicians and Celebrities
    if (subject.includes('slash')) {
      return "Slash is a legendary guitarist, best known as the lead guitarist of Guns N' Roses! His real name is Saul Hudson, and he's famous for his distinctive top hat, curly hair, and incredible guitar solos. He played on classic songs like 'Sweet Child O' Mine' and 'November Rain.' He's considered one of the greatest rock guitarists of all time!"
    }
    
    if (subject.includes('michael jackson')) {
      return "Michael Jackson was the King of Pop! He was an incredibly talented singer, dancer, and performer who revolutionized music and entertainment. He started as a child with the Jackson 5, then became a solo superstar with albums like 'Thriller,' 'Bad,' and 'Off the Wall.' He's famous for the moonwalk dance and songs like 'Billie Jean' and 'Beat It!'"
    }
    
    if (subject.includes('elvis')) {
      return "Elvis Presley was the King of Rock and Roll! He revolutionized popular music in the 1950s with his unique blend of country, rhythm and blues, and pop. He was known for his distinctive voice, energetic performances, and hip-shaking dance moves. Famous songs include 'Hound Dog,' 'Jailhouse Rock,' and 'Can't Help Falling in Love!'"
    }
    
    // Historical Figures
    if (subject.includes('einstein')) {
      return "Albert Einstein was one of the greatest physicists in history! He developed the theory of relativity, which revolutionized our understanding of space, time, and gravity. He's famous for the equation E=mc², won the Nobel Prize in Physics in 1921, and his work laid the foundation for modern physics!"
    }
    
    if (subject.includes('shakespeare')) {
      return "William Shakespeare was an English playwright and poet from the 16th and 17th centuries, often called the greatest writer in the English language! He wrote famous plays like 'Romeo and Juliet,' 'Hamlet,' 'Macbeth,' and 'A Midsummer Night's Dream.' He created many words and phrases we still use today!"
    }
    
    // Actors and Movie Stars
    if (subject.includes('robert downey jr') || subject.includes('rdj')) {
      return "Robert Downey Jr. is an amazing actor best known for playing Iron Man in the Marvel Cinematic Universe! He brought Tony Stark to life with perfect wit and charisma, launching the entire MCU with the first Iron Man movie in 2008. His portrayal made him one of the highest-paid actors in Hollywood!"
    }
    
    if (subject.includes('tom holland')) {
      return "Tom Holland is a British actor who plays Spider-Man in the Marvel Cinematic Universe! He's known for doing many of his own stunts and bringing a youthful, energetic performance to Peter Parker. Before becoming Spider-Man, he was a dancer and gymnast, which helped him with the acrobatic scenes!"
    }
    
    // Technology Leaders
    if (subject.includes('steve jobs')) {
      return "Steve Jobs was the co-founder and longtime CEO of Apple Inc.! He revolutionized personal computing with the Apple II, then later transformed multiple industries with products like the iMac, iPod, iPhone, and iPad. He was known for his perfectionism and innovative design sense!"
    }
    
    if (subject.includes('elon musk')) {
      return "Elon Musk is an entrepreneur and innovator who's working to revolutionize transportation and space exploration! He's the CEO of Tesla, making electric cars mainstream, and SpaceX, which is working to make humans a multi-planetary species. He's known for his ambitious goals!"
    }
    
    // Generic response for unknown people
    return `I'm not immediately familiar with ${subject}, but I'd love to learn more! Could you tell me more about them? Are they from entertainment, history, science, or another field? I'm always excited to learn about new people and topics!`
  }
  
  // What questions - Enhanced knowledge
  if (input.includes('what is') || input.includes('what\'s') || input.includes('tell me what')) {
    let subject = input.replace(/.*(?:what is|what's|tell me what)\s+/, '').replace(/\?/g, '').trim()
    
    if (subject.includes('gravity')) {
      return "Gravity is the force that attracts objects with mass toward each other! On Earth, it's what keeps us on the ground and makes things fall down. The more massive an object is, the stronger its gravitational pull. Einstein showed us that gravity actually curves space and time!"
    }
    
    if (subject.includes('photosynthesis')) {
      return "Photosynthesis is how plants make their own food using sunlight! Plants take in carbon dioxide from the air and water from their roots, then use chlorophyll to capture sunlight energy. They combine these to make glucose for energy and release oxygen - which is lucky for us since we need oxygen to breathe!"
    }
    
    if (subject.includes('dna')) {
      return "DNA is like the instruction manual for all living things! It stands for deoxyribonucleic acid and contains the genetic code that determines everything about an organism. It's shaped like a twisted ladder called a double helix and is found in every cell nucleus!"
    }
    
    return `That's a fascinating question about ${subject}! I'd love to help explain it. Could you be a bit more specific about what aspect you're curious about?`
  }
  
  // How questions - Enhanced
  if (input.includes('how do') || input.includes('how can') || input.includes('how to') || input.includes('how does')) {
    let topic = input.replace(/.*(?:how do|how can|how to|how does)\s+/, '').replace(/\?/g, '').trim()
    
    if (topic.includes('fly') || topic.includes('airplane')) {
      return "Airplanes fly using four main forces: lift, weight, thrust, and drag! The wings are shaped so that air moves faster over the top than the bottom, creating lower pressure above - this creates lift. When lift is greater than weight, the plane flies!"
    }
    
    if (topic.includes('internet work') || topic.includes('wifi work')) {
      return "The internet works like a giant network of connected computers! When you send a message, your device breaks the information into small packets, which travel through various routes to reach their destination. It's like a super-fast postal system for digital information!"
    }
    
    return `That's a great question about ${topic}! I'd be happy to help explain the process. Could you give me more context about what you're trying to understand?`
  }
  
  // Default engaging responses
  const defaultResponses = [
    "That's really interesting! Could you tell me more about that?",
    "I find that fascinating! What's your experience with that?",
    "That's a great topic! What made you think of that?",
    "I'd love to learn more about your perspective on that.",
    "That sounds intriguing! Can you elaborate on that?",
    "That's worth discussing! What's your take on it?"
  ]
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}
