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
  
  // Portuguese cultural celebrations and June festivals
  if (input.includes('portuguese') && input.includes('june') || 
      input.includes('portugal') && input.includes('june') ||
      input.includes('june') && (input.includes('portuguese') || input.includes('portugal'))) {
    return "June is incredibly important in Portuguese cultural celebrations! The main event is the Festas de São João (St. John's Festival) celebrated on June 23-24, especially in Porto and Braga. These festivals feature traditional music, dancing, grilled sardines, and the famous 'martelinhos' (plastic hammers) that people use to playfully hit each other on the head. There are also the Festas de Santo António in Lisbon (June 12-13) with parades, traditional costumes, and grilled sardines. These celebrations honor Portuguese saints and bring communities together with music, food, and traditional customs that have been passed down for generations."
  }
  
  if (input.includes('são joão') || input.includes('sao joao') || input.includes('st john')) {
    return "São João (St. John's Festival) is one of Portugal's most beloved celebrations, held on June 23-24, especially in Porto and Braga. It's a magical night where the streets come alive with music, dancing, and traditional customs. People carry 'martelinhos' (plastic hammers) and playfully tap each other on the head, symbolizing good luck. The air is filled with the aroma of grilled sardines, and there are colorful parades with traditional costumes. It's a celebration of community, tradition, and Portuguese culture that brings people together in a festive atmosphere."
  }
  
  if (input.includes('santo antónio') || input.includes('santo antonio') || input.includes('st anthony')) {
    return "Santo António (St. Anthony's Festival) is celebrated in Lisbon on June 12-13, honoring the city's patron saint. The festival features colorful parades with traditional Portuguese costumes, especially the 'Marchas Populares' where different neighborhoods compete with elaborate floats and performances. The streets are filled with grilled sardines, traditional music, and dancing. It's a time when Lisbon's neighborhoods come together to celebrate their heritage and community spirit through music, food, and cultural traditions."
  }
  
  // Portugal general information
  if (input.includes('portugal') && !input.includes('june')) {
    return "Portugal is a fascinating country! Founded in 1143 by D. Afonso Henriques, it's one of the oldest nations with stable borders. Portugal is famous for the Age of Discoveries (15th-16th centuries) with explorers like Vasco da Gama and Magalhães. The Portuguese language is spoken in 9 countries. Portugal is known for Fado music (UNESCO World Heritage), beautiful azulejo tiles, delicious cuisine (bacalhau, pastéis de nata, caldo verde), and vibrant festivals. Major cities include Lisbon (capital), Porto, Coimbra, and the beautiful Algarve region. Portugal is also the world's largest cork producer and home to football legend Cristiano Ronaldo! 🇵🇹"
  }
  
  // History topics
  if (input.includes('history') || input.includes('história') || input.includes('ancient') || input.includes('antiguidade')) {
    if (input.includes('egypt') || input.includes('egito')) {
      return "Ancient Egypt was one of the world's greatest civilizations! It lasted for over 3000 years along the Nile River. The Egyptians built incredible pyramids as tombs for pharaohs, developed hieroglyphic writing, and created a complex society with advanced medicine, astronomy, and architecture. Famous pharaohs include Tutankhamun, Cleopatra, and Ramses II. The Great Pyramid of Giza is one of the Seven Wonders of the Ancient World and was built around 2560 BCE."
    }
    if (input.includes('rome') || input.includes('roma')) {
      return "Ancient Rome was one of the most powerful empires in history! It began as a small city-state in 753 BCE and grew to control most of Europe, North Africa, and parts of Asia. The Romans were famous for their military, engineering (roads, aqueducts, Colosseum), law system, and culture. Important figures include Julius Caesar, Augustus, and Constantine. The Roman Empire fell in 476 CE, but its influence continues today in language, law, and architecture."
    }
    if (input.includes('greece') || input.includes('grécia')) {
      return "Ancient Greece was the birthplace of democracy, philosophy, and Western civilization! The Greeks made incredible contributions to art, science, mathematics, and literature. Famous Greek philosophers include Socrates, Plato, and Aristotle. The Greeks also created the Olympic Games, built magnificent temples like the Parthenon, and developed democracy in Athens. Greek mythology with gods like Zeus, Athena, and Apollo continues to influence culture today."
    }
    return "History is the study of past events and human societies! It's divided into periods like Prehistory (before writing), Antiquity (ancient civilizations), Middle Ages, Modern Age, and Contemporary Age. History helps us understand how we got here and learn from past mistakes and successes. What specific period or civilization interests you?"
  }
  
  // Science topics
  if (input.includes('science') || input.includes('ciência') || input.includes('physics') || input.includes('chemistry') || input.includes('biology')) {
    if (input.includes('einstein') || input.includes('relativity')) {
      return "Albert Einstein was one of the greatest physicists in history! He developed the theory of relativity, which revolutionized our understanding of space, time, and gravity. His famous equation E=mc² shows that energy and matter are related. Einstein won the Nobel Prize in Physics in 1921 and his work laid the foundation for modern physics, including GPS technology and nuclear energy!"
    }
    if (input.includes('dna') || input.includes('genetics')) {
      return "DNA is like the instruction manual for all living things! It stands for deoxyribonucleic acid and contains the genetic code that determines everything about an organism. It's shaped like a twisted ladder called a double helix and is found in every cell nucleus. DNA controls traits like eye color, height, and even some behaviors. The human genome contains about 3 billion base pairs and we share 99.9% of our DNA with other humans!"
    }
    if (input.includes('black hole') || input.includes('buraco negro')) {
      return "Black holes are incredibly mysterious objects in space! They form when massive stars collapse and their gravity becomes so strong that nothing can escape, not even light. Black holes have an 'event horizon' - a point of no return. There are small black holes and supermassive ones at the centers of galaxies. Scientists think they might be connected to time travel and wormholes. The first image of a black hole was captured in 2019!"
    }
    return "Science is the systematic study of the natural world! It includes physics (matter and energy), chemistry (substances and reactions), biology (living things), astronomy (space), and many other fields. Science helps us understand how the universe works and has led to incredible discoveries and inventions. What specific area of science interests you?"
  }
  
  // Technology topics
  if (input.includes('technology') || input.includes('tecnologia') || input.includes('ai') || input.includes('artificial intelligence')) {
    if (input.includes('ai') || input.includes('artificial intelligence')) {
      return "Artificial Intelligence (AI) is technology that enables computers to perform tasks that typically require human intelligence! AI learns from data - like texts, images, and voices. There are different types: machine learning, deep learning, and natural language processing (like me!). AI is used in many areas: virtual assistants (Siri, Alexa), recommendation systems (Netflix, Spotify), medical diagnosis, autonomous vehicles, and creative tools. AI doesn't think or feel like humans - it processes patterns using algorithms and mathematical logic."
    }
    if (input.includes('internet') || input.includes('web')) {
      return "The internet is a global network of connected computers! It works like a super-fast postal system for digital information. When you send a message, your device breaks the information into small packets that travel through various routes to reach their destination. The World Wide Web (created by Tim Berners-Lee in 1989) made the internet user-friendly with websites and browsers. Today, the internet connects billions of people and devices worldwide!"
    }
    return "Technology is the application of scientific knowledge to solve problems and improve human life! It includes computers, smartphones, the internet, robotics, renewable energy, and much more. Technology has transformed how we communicate, work, learn, and live. What specific technology interests you?"
  }
  
  // Celebrity topics
  if (input.includes('celebrity') || input.includes('famous') || input.includes('actor') || input.includes('singer') || input.includes('musician')) {
    if (input.includes('cristiano ronaldo') || input.includes('ronaldo')) {
      return "Cristiano Ronaldo is one of the greatest football players of all time! Born in Portugal in 1985, he's won 5 Ballon d'Or awards and played for top clubs like Manchester United, Real Madrid, and currently Al Nassr. He's Portugal's all-time top scorer and has won multiple Champions League titles. Ronaldo is known for his incredible athleticism, goal-scoring ability, and dedication to fitness. He's also one of the most followed people on social media with over 635 million followers! 🇵🇹⚽"
    }
    if (input.includes('michael jackson')) {
      return "Michael Jackson was the King of Pop! He was an incredibly talented singer, dancer, and performer who revolutionized music and entertainment. He started as a child with the Jackson 5, then became a solo superstar with albums like 'Thriller,' 'Bad,' and 'Off the Wall.' He's famous for the moonwalk dance and songs like 'Billie Jean' and 'Beat It!' Jackson won 13 Grammy Awards and is considered one of the most influential artists in history."
    }
    if (input.includes('leonardo dicaprio')) {
      return "Leonardo DiCaprio is one of Hollywood's most respected actors! He's known for his incredible performances in films like 'Titanic,' 'The Revenant' (which won him his first Oscar), 'Inception,' and 'The Wolf of Wall Street.' DiCaprio is also a passionate environmental activist who uses his fame to raise awareness about climate change. He's been nominated for 6 Academy Awards and has worked with many of the industry's top directors."
    }
    if (input.includes('bad bunny')) {
      return "Bad Bunny (Benito Antonio Martínez Ocasio) is one of the biggest Latin artists in the world! Born in Puerto Rico in 1994, he's known for reggaeton and trap music. He broke records on Spotify as the most-streamed artist globally in 2020, 2021, and 2022. His albums like 'Un Verano Sin Ti' and 'YHLQMDLG' have been massive hits. Bad Bunny is famous for his unique fashion style, social commentary in his lyrics, and pride in his Latin identity. He even appeared in WWE as a guest wrestler!"
    }
    return "There are so many amazing celebrities in entertainment, sports, and other fields! From actors and musicians to athletes and influencers, celebrities often have fascinating stories and achievements. Who specifically would you like to know more about?"
  }
  
  // Economics topics
  if (input.includes('economy') || input.includes('economia') || input.includes('money') || input.includes('business')) {
    if (input.includes('richest') || input.includes('billionaire') || input.includes('wealthy')) {
      return "The world's richest people include Elon Musk (Tesla, SpaceX) with over $230 billion, Bernard Arnault (LVMH luxury brands) with over $220 billion, and Jeff Bezos (Amazon) with over $170 billion. These fortunes change constantly with stock market fluctuations. Many of the wealthiest people made their money through technology companies, investments, or inherited family businesses. Warren Buffett, Bill Gates, and Mark Zuckerberg are also among the world's richest people."
    }
    if (input.includes('inflation') || input.includes('prices')) {
      return "Inflation is when prices increase over time, meaning your money buys less than before. It's measured by tracking the cost of goods and services. Moderate inflation (2-3% per year) is normal and healthy for an economy. High inflation can hurt people's purchasing power and savings. Central banks try to control inflation through interest rates and monetary policy. Inflation can be caused by increased demand, supply shortages, or government policies."
    }
    return "Economics is the study of how people, businesses, and governments produce, distribute, and consume goods and services. It includes concepts like supply and demand, inflation, GDP (Gross Domestic Product), and different economic systems (capitalism, socialism, mixed economies). Economics helps us understand how money, trade, and resources work in society."
  }
  
  // Music topics
  if (input.includes('music') || input.includes('música') || input.includes('song') || input.includes('band')) {
    if (input.includes('queen') || input.includes('freddie mercury')) {
      return "Queen was one of the greatest rock bands of all time! Led by the incredible Freddie Mercury, they created timeless hits like 'Bohemian Rhapsody,' 'We Will Rock You,' and 'Another One Bites the Dust.' Freddie Mercury had an amazing voice and was a spectacular performer. The band also included Brian May (guitar), Roger Taylor (drums), and John Deacon (bass). Queen's music continues to inspire generations of musicians and fans worldwide."
    }
    if (input.includes('beatles') || input.includes('john lennon')) {
      return "The Beatles were the most influential band in music history! From Liverpool, England, they revolutionized popular music in the 1960s. The band included John Lennon, Paul McCartney, George Harrison, and Ringo Starr. They created countless hits like 'Hey Jude,' 'Let It Be,' and 'Yesterday.' The Beatles changed how music was made, recorded, and performed. Their influence on culture, fashion, and music continues today."
    }
    return "Music is a universal language that connects people across cultures! It includes many genres like classical, rock, jazz, pop, hip-hop, and traditional folk music. Music can express emotions, tell stories, and bring people together. Throughout history, music has been used for celebration, communication, and artistic expression. What type of music interests you?"
  }
  
  // Sports topics
  if (input.includes('soccer') || input.includes('football') || input.includes('futebol') || input.includes('sport')) {
    if (input.includes('messi') || input.includes('lionel')) {
      return "Lionel Messi is one of the greatest football players ever! The Argentine superstar has won 8 Ballon d'Or awards (a record) and led Argentina to World Cup victory in 2022. He spent most of his career at Barcelona, where he won numerous Champions League titles and La Liga championships. Messi is known for his incredible dribbling skills, vision, and goal-scoring ability. He currently plays for Inter Miami in the United States."
    }
    if (input.includes('basketball') || input.includes('nba') || input.includes('jordan')) {
      return "Basketball is a fast-paced team sport invented by Dr. James Naismith in 1891! The NBA (National Basketball Association) is the world's premier basketball league. Michael Jordan is considered the greatest player ever, winning 6 NBA championships with the Chicago Bulls. Other legends include LeBron James, Kobe Bryant, and Magic Johnson. Basketball is played worldwide and is especially popular in the United States, Europe, and Asia."
    }
    return "Sports bring people together and promote health, teamwork, and competition! Popular sports include football (soccer), basketball, tennis, baseball, and many others. Sports can be played professionally, in schools, or just for fun. They teach important life skills like discipline, perseverance, and cooperation. What sport interests you?"
  }
  
  // Cultural celebrations and festivals
  if (input.includes('festival') || input.includes('celebration') || input.includes('cultural')) {
    if (input.includes('portuguese') || input.includes('portugal')) {
      return "Portuguese culture is rich with festivals and celebrations! Some of the most important include São João in Porto (June 23-24), Santo António in Lisbon (June 12-13), and the Festa dos Tabuleiros in Tomar (every 4 years). These celebrations feature traditional music, dancing, colorful parades, and delicious Portuguese cuisine like grilled sardines and traditional pastries. They're a wonderful way to experience Portuguese hospitality and cultural heritage."
    }
    return "Cultural festivals and celebrations are wonderful ways to experience different traditions and bring communities together! They often feature traditional music, dancing, food, and customs that have been passed down through generations. What specific culture or festival are you interested in learning about?"
  }
  
  // Enhanced knowledge base for "who is" questions
  if (input.includes('who is') || input.includes('who\'s') || input.includes('tell me who') || input.includes('do you know who') || input.includes('tell me everything you know about')) {
    let subject = input.replace(/.*(?:who is|who's|tell me who|do you know who|tell me everything you know about)\s+/, '').replace(/\?/g, '').trim()
    
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
    if (subject.includes('slash') || subject.includes('guitarist') && (subject.includes('guns') || subject.includes('roses'))) {
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
    
    if (subject.includes('portuguese') && subject.includes('culture')) {
      return "Portuguese culture is rich and diverse, shaped by its maritime history and global exploration! It includes traditional Fado music, beautiful azulejo tiles, delicious cuisine with seafood and pastries, and vibrant festivals like São João and Santo António. Portuguese people are known for their warm hospitality, love of family, and strong community bonds."
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
  
  // Why questions - Enhanced
  if (input.includes('why is') || input.includes('why are') || input.includes('why do')) {
    let topic = input.replace(/.*(?:why is|why are|why do)\s+/, '').replace(/\?/g, '').trim()
    
    if (topic.includes('june') && (topic.includes('important') || topic.includes('special'))) {
      return "June is important for many reasons! In the Northern Hemisphere, it's the start of summer with the longest days of the year. It's also a month filled with cultural celebrations - in Portugal, there are the Festas de São João and Santo António festivals. June also marks important events like graduations, weddings, and the beginning of vacation season for many people!"
    }
    
    if (topic.includes('portuguese') && topic.includes('celebrate')) {
      return "Portuguese people celebrate to honor their cultural heritage, religious traditions, and community bonds! Festivals like São João and Santo António bring people together to share traditional food, music, and customs. These celebrations strengthen community ties and pass down cultural traditions to younger generations. They're also a way to express gratitude and joy for Portuguese identity and history."
    }
    
    return `That's an interesting question about why ${topic}! I'd love to help explain the reasons behind it. Could you give me more context about what specific aspect you're curious about?`
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
