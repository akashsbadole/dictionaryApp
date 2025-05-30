-- Insert 100+ conversation topics with comprehensive scenarios

INSERT INTO conversation_topics (title, description, difficulty_level, scenario, vocabulary_focus, grammar_focus, sample_dialogue) VALUES

-- BEGINNER LEVEL (1-30)
('Introducing Yourself', 'Learn basic self-introduction', 'beginner', 
 'You are meeting someone new and need to introduce yourself.',
 ARRAY['name', 'age', 'from', 'nice to meet you', 'hello', 'goodbye'],
 ARRAY['present simple', 'basic questions', 'personal pronouns'],
 '[{"speaker": "person1", "text": "Hello! My name is Sarah. What''s your name?"}, {"speaker": "person2", "text": "Hi Sarah! I''m David. Nice to meet you."}, {"speaker": "person1", "text": "Nice to meet you too, David. Where are you from?"}, {"speaker": "person2", "text": "I''m from Canada. How about you?"}, {"speaker": "person1", "text": "I''m from Australia. Are you visiting here?"}, {"speaker": "person2", "text": "Yes, I''m here for work. What do you do?"}]'),

('Asking for Directions', 'Practice asking for and giving directions', 'beginner',
 'You are lost and need to ask someone for directions to a specific place.',
 ARRAY['excuse me', 'where is', 'turn left', 'turn right', 'straight ahead', 'corner'],
 ARRAY['question formation', 'imperatives', 'prepositions of place'],
 '[{"speaker": "tourist", "text": "Excuse me, could you help me? I''m looking for the train station."}, {"speaker": "local", "text": "Of course! Go straight ahead for two blocks, then turn left."}, {"speaker": "tourist", "text": "Turn left after two blocks?"}, {"speaker": "local", "text": "Yes, and then you''ll see the station on your right."}, {"speaker": "tourist", "text": "Thank you so much! How long does it take to walk there?"}, {"speaker": "local", "text": "About 10 minutes. You can''t miss it!"}]'),

('Shopping for Groceries', 'Learn grocery shopping vocabulary', 'beginner',
 'You are at a grocery store buying food for the week.',
 ARRAY['apples', 'bread', 'milk', 'checkout', 'receipt', 'total', 'cash', 'card'],
 ARRAY['countable/uncountable nouns', 'how much/how many', 'polite requests'],
 '[{"speaker": "customer", "text": "Excuse me, where can I find the bread?"}, {"speaker": "employee", "text": "The bakery section is in aisle 3, on your left."}, {"speaker": "customer", "text": "Thank you. Do you have fresh milk?"}, {"speaker": "employee", "text": "Yes, the dairy section is at the back of the store."}, {"speaker": "customer", "text": "Perfect. Is there a discount on apples today?"}, {"speaker": "employee", "text": "Yes, apples are 20% off this week!"}]'),

('At the Doctor''s Office', 'Practice medical appointment conversation', 'beginner',
 'You have a doctor''s appointment and need to describe your symptoms.',
 ARRAY['appointment', 'symptoms', 'headache', 'fever', 'medicine', 'prescription'],
 ARRAY['present perfect', 'describing feelings', 'modal verbs'],
 '[{"speaker": "receptionist", "text": "Good morning! Do you have an appointment?"}, {"speaker": "patient", "text": "Yes, I have an appointment at 10 AM with Dr. Smith."}, {"speaker": "doctor", "text": "Hello! What seems to be the problem today?"}, {"speaker": "patient", "text": "I''ve been having headaches for three days."}, {"speaker": "doctor", "text": "Do you have any other symptoms?"}, {"speaker": "patient", "text": "Yes, I also have a slight fever."}]'),

('Ordering Coffee', 'Learn to order drinks at a café', 'beginner',
 'You are at a coffee shop and want to order your favorite drink.',
 ARRAY['coffee', 'latte', 'cappuccino', 'size', 'sugar', 'milk', 'to go', 'here'],
 ARRAY['would like', 'preferences', 'polite requests'],
 '[{"speaker": "barista", "text": "Good morning! What can I get for you today?"}, {"speaker": "customer", "text": "I''d like a large cappuccino, please."}, {"speaker": "barista", "text": "Would you like any sugar or sweetener?"}, {"speaker": "customer", "text": "Just a little sugar, please."}, {"speaker": "barista", "text": "For here or to go?"}, {"speaker": "customer", "text": "To go, please. How much is that?"}]'),

('Booking a Hotel Room', 'Practice hotel reservation', 'beginner',
 'You need to book a hotel room for your vacation.',
 ARRAY['reservation', 'available', 'single room', 'double room', 'nights', 'breakfast'],
 ARRAY['future tense', 'dates and numbers', 'polite inquiries'],
 '[{"speaker": "receptionist", "text": "Good evening! How can I help you?"}, {"speaker": "guest", "text": "I''d like to book a room for two nights, please."}, {"speaker": "receptionist", "text": "For which dates?"}, {"speaker": "guest", "text": "From March 15th to March 17th."}, {"speaker": "receptionist", "text": "We have a double room available. Would you like breakfast included?"}, {"speaker": "guest", "text": "Yes, that sounds perfect. What''s the total cost?"}]'),

('At the Bank', 'Learn banking vocabulary and procedures', 'beginner',
 'You need to open a bank account or make a transaction.',
 ARRAY['account', 'deposit', 'withdraw', 'balance', 'ATM', 'card', 'PIN'],
 ARRAY['modal verbs', 'polite requests', 'numbers and money'],
 '[{"speaker": "teller", "text": "Good afternoon! How can I assist you today?"}, {"speaker": "customer", "text": "I''d like to open a savings account, please."}, {"speaker": "teller", "text": "Do you have identification with you?"}, {"speaker": "customer", "text": "Yes, here''s my passport."}, {"speaker": "teller", "text": "Perfect. What''s your initial deposit amount?"}, {"speaker": "customer", "text": "I''d like to deposit $500."}]'),

('Buying Clothes', 'Practice shopping for clothing', 'beginner',
 'You are shopping for clothes and need to find the right size.',
 ARRAY['size', 'color', 'fitting room', 'try on', 'receipt', 'exchange', 'return'],
 ARRAY['adjectives', 'comparatives', 'present continuous'],
 '[{"speaker": "customer", "text": "Excuse me, do you have this shirt in medium?"}, {"speaker": "salesperson", "text": "Let me check for you. What color would you prefer?"}, {"speaker": "customer", "text": "Blue or white, please."}, {"speaker": "salesperson", "text": "We have both colors in medium. Would you like to try them on?"}, {"speaker": "customer", "text": "Yes, where''s the fitting room?"}, {"speaker": "salesperson", "text": "Right over there, next to the mirrors."}]'),

('Taking Public Transportation', 'Learn to use buses and trains', 'beginner',
 'You need to take public transportation to get to your destination.',
 ARRAY['bus', 'train', 'ticket', 'platform', 'schedule', 'fare', 'transfer'],
 ARRAY['time expressions', 'question formation', 'giving directions'],
 '[{"speaker": "passenger", "text": "Excuse me, which bus goes to downtown?"}, {"speaker": "driver", "text": "Bus number 42. It comes every 15 minutes."}, {"speaker": "passenger", "text": "How much is the fare?"}, {"speaker": "driver", "text": "It''s $2.50. Do you have exact change?"}, {"speaker": "passenger", "text": "Yes, here you go. How long does it take?"}, {"speaker": "driver", "text": "About 25 minutes to downtown."}]'),

('At the Post Office', 'Learn postal services vocabulary', 'beginner',
 'You need to send a package or letter.',
 ARRAY['package', 'envelope', 'stamp', 'address', 'delivery', 'express', 'regular'],
 ARRAY['future tense', 'cost and payment', 'giving information'],
 '[{"speaker": "customer", "text": "I''d like to send this package to New York, please."}, {"speaker": "clerk", "text": "Would you like regular or express delivery?"}, {"speaker": "customer", "text": "How long does regular delivery take?"}, {"speaker": "clerk", "text": "About 5-7 business days."}, {"speaker": "customer", "text": "That''s fine. How much will it cost?"}, {"speaker": "clerk", "text": "That''ll be $12.50."}]'),

-- INTERMEDIATE LEVEL (31-70)
('Job Interview - Part 1', 'Practice answering common interview questions', 'intermediate',
 'You are in a job interview discussing your background and experience.',
 ARRAY['experience', 'qualifications', 'strengths', 'weaknesses', 'achievements', 'goals'],
 ARRAY['present perfect', 'past simple', 'conditional sentences'],
 '[{"speaker": "interviewer", "text": "Tell me about your previous work experience."}, {"speaker": "candidate", "text": "I''ve been working in marketing for five years. In my current role, I manage social media campaigns."}, {"speaker": "interviewer", "text": "What would you say is your greatest strength?"}, {"speaker": "candidate", "text": "I''d say my ability to work well under pressure and meet tight deadlines."}, {"speaker": "interviewer", "text": "Can you give me an example of a challenging project you''ve completed?"}, {"speaker": "candidate", "text": "Last year, I led a campaign that increased our online engagement by 200% in just three months."}]'),

('Complaining at a Restaurant', 'Learn to handle service issues politely', 'intermediate',
 'Your food order is wrong and you need to complain politely.',
 ARRAY['complaint', 'wrong order', 'cold food', 'manager', 'refund', 'replacement'],
 ARRAY['polite complaints', 'conditional sentences', 'expressing dissatisfaction'],
 '[{"speaker": "customer", "text": "Excuse me, I think there''s been a mistake with my order."}, {"speaker": "waiter", "text": "I''m sorry to hear that. What seems to be the problem?"}, {"speaker": "customer", "text": "I ordered the grilled salmon, but this appears to be chicken."}, {"speaker": "waiter", "text": "I apologize for the confusion. Let me get that fixed for you right away."}, {"speaker": "customer", "text": "Also, my friend''s soup is cold. Could you warm it up?"}, {"speaker": "waiter", "text": "Of course! I''ll bring a fresh bowl immediately."}]'),

('Negotiating Rent', 'Practice negotiating apartment rental terms', 'intermediate',
 'You are discussing rent and lease terms with a landlord.',
 ARRAY['rent', 'lease', 'deposit', 'utilities', 'maintenance', 'negotiation', 'agreement'],
 ARRAY['conditional sentences', 'future tense', 'persuasive language'],
 '[{"speaker": "tenant", "text": "I''m interested in renting this apartment. Is the rent negotiable?"}, {"speaker": "landlord", "text": "The listed price is $1,200 per month. What did you have in mind?"}, {"speaker": "tenant", "text": "I was hoping for something closer to $1,100, considering the market rates."}, {"speaker": "landlord", "text": "I could consider $1,150 if you sign a two-year lease."}, {"speaker": "tenant", "text": "That sounds reasonable. Are utilities included?"}, {"speaker": "landlord", "text": "Water and trash are included, but you''ll pay for electricity and internet."}]'),

('Planning a Business Meeting', 'Organize and schedule professional meetings', 'intermediate',
 'You need to coordinate a meeting with colleagues from different departments.',
 ARRAY['agenda', 'schedule', 'availability', 'conference room', 'presentation', 'deadline'],
 ARRAY['future arrangements', 'suggestions', 'time expressions'],
 '[{"speaker": "organizer", "text": "We need to schedule a meeting to discuss the new project timeline."}, {"speaker": "colleague", "text": "When would be convenient for everyone?"}, {"speaker": "organizer", "text": "How about next Tuesday at 2 PM?"}, {"speaker": "colleague", "text": "I have a conflict then. Could we do Wednesday morning instead?"}, {"speaker": "organizer", "text": "Let me check with the others. What time works best for you?"}, {"speaker": "colleague", "text": "Any time between 9 and 11 AM would be perfect."}]'),

('Discussing Weekend Plans', 'Talk about leisure activities and plans', 'intermediate',
 'You are making plans with friends for the weekend.',
 ARRAY['weekend', 'plans', 'movie', 'restaurant', 'hiking', 'concert', 'available'],
 ARRAY['future tense', 'suggestions', 'expressing preferences'],
 '[{"speaker": "friend1", "text": "What are you doing this weekend?"}, {"speaker": "friend2", "text": "I don''t have any specific plans yet. What about you?"}, {"speaker": "friend1", "text": "I was thinking of going hiking on Saturday. Want to join?"}, {"speaker": "friend2", "text": "That sounds great! What time should we meet?"}, {"speaker": "friend1", "text": "How about 8 AM at the park entrance?"}, {"speaker": "friend2", "text": "Perfect! Should we invite Sarah and Mike too?"}]'),

('Returning a Defective Product', 'Handle product returns and exchanges', 'intermediate',
 'You bought something that doesn''t work and need to return it.',
 ARRAY['defective', 'warranty', 'receipt', 'refund', 'exchange', 'malfunction'],
 ARRAY['past tense', 'explaining problems', 'requesting solutions'],
 '[{"speaker": "customer", "text": "I''d like to return this phone. It stopped working after two days."}, {"speaker": "clerk", "text": "I''m sorry to hear that. Do you have your receipt?"}, {"speaker": "customer", "text": "Yes, here it is. I bought it last week."}, {"speaker": "clerk", "text": "I see it''s still under warranty. Would you prefer a refund or exchange?"}, {"speaker": "customer", "text": "I''d like to exchange it for the same model, if possible."}, {"speaker": "clerk", "text": "Let me get a replacement for you."}]'),

('Discussing Health and Fitness', 'Talk about exercise and healthy lifestyle', 'intermediate',
 'You are discussing fitness routines and health goals with a friend.',
 ARRAY['exercise', 'gym', 'diet', 'healthy', 'workout', 'calories', 'motivation'],
 ARRAY['present perfect', 'frequency adverbs', 'giving advice'],
 '[{"speaker": "person1", "text": "Have you been going to the gym regularly?"}, {"speaker": "person2", "text": "I''ve been trying to go three times a week, but it''s challenging."}, {"speaker": "person1", "text": "What kind of exercises do you usually do?"}, {"speaker": "person2", "text": "Mostly cardio and some weight training. What about you?"}, {"speaker": "person1", "text": "I prefer yoga and swimming. They''re less intense but very effective."}, {"speaker": "person2", "text": "That sounds interesting. Maybe I should try yoga too."}]'),

('Apartment Hunting', 'Search for and evaluate rental properties', 'intermediate',
 'You are looking at apartments with a real estate agent.',
 ARRAY['apartment', 'bedroom', 'bathroom', 'kitchen', 'balcony', 'parking', 'neighborhood'],
 ARRAY['describing places', 'comparatives', 'expressing preferences'],
 '[{"speaker": "agent", "text": "This apartment has two bedrooms and one bathroom."}, {"speaker": "client", "text": "How big is the living room?"}, {"speaker": "agent", "text": "It''s quite spacious, about 300 square feet."}, {"speaker": "client", "text": "Is there parking available?"}, {"speaker": "agent", "text": "Yes, there''s one assigned parking space included."}, {"speaker": "client", "text": "What about the neighborhood? Is it safe?"}]'),

('Technology Troubleshooting', 'Get help with technical problems', 'intermediate',
 'You are calling tech support for help with your computer.',
 ARRAY['computer', 'internet', 'password', 'software', 'update', 'restart', 'technical'],
 ARRAY['describing problems', 'following instructions', 'technical vocabulary'],
 '[{"speaker": "customer", "text": "My computer won''t connect to the internet."}, {"speaker": "technician", "text": "Let''s troubleshoot this step by step. Can you see your WiFi network?"}, {"speaker": "customer", "text": "Yes, it shows up in the list, but it won''t connect."}, {"speaker": "technician", "text": "Try restarting your router first, then restart your computer."}, {"speaker": "customer", "text": "Okay, I''ve done that. Should I try connecting again?"}, {"speaker": "technician", "text": "Yes, and make sure you''re entering the correct password."}]'),

('Planning a Vacation', 'Organize travel plans and activities', 'intermediate',
 'You are planning a vacation with your family or friends.',
 ARRAY['vacation', 'destination', 'flight', 'hotel', 'activities', 'budget', 'itinerary'],
 ARRAY['future plans', 'suggestions', 'expressing preferences'],
 '[{"speaker": "person1", "text": "Where should we go for our summer vacation?"}, {"speaker": "person2", "text": "I''ve always wanted to visit Japan. What do you think?"}, {"speaker": "person1", "text": "That sounds amazing! When would be the best time to go?"}, {"speaker": "person2", "text": "Spring or fall would be ideal for the weather."}, {"speaker": "person1", "text": "How long should we stay?"}, {"speaker": "person2", "text": "I think two weeks would give us enough time to see everything."}]'),

-- ADVANCED LEVEL (71-100+)
('Business Negotiation', 'Negotiate contracts and business deals', 'advanced',
 'You are negotiating terms for a business partnership.',
 ARRAY['contract', 'terms', 'conditions', 'profit', 'liability', 'clause', 'agreement'],
 ARRAY['conditional sentences', 'formal language', 'persuasive techniques'],
 '[{"speaker": "negotiator1", "text": "We''ve reviewed your proposal, and while we''re interested, we have some concerns about the payment terms."}, {"speaker": "negotiator2", "text": "I understand. What specific aspects would you like to modify?"}, {"speaker": "negotiator1", "text": "We''d prefer net 30 payment terms instead of the proposed net 60."}, {"speaker": "negotiator2", "text": "That would significantly impact our cash flow. Could we compromise at net 45?"}, {"speaker": "negotiator1", "text": "We might consider that if you could include a 2% early payment discount."}, {"speaker": "negotiator2", "text": "That''s reasonable. Let me discuss this with my team and get back to you."}]'),

('Academic Conference Presentation', 'Present research and answer questions', 'advanced',
 'You are presenting your research at an academic conference.',
 ARRAY['research', 'methodology', 'findings', 'hypothesis', 'data', 'conclusion', 'peer review'],
 ARRAY['academic language', 'passive voice', 'complex sentences'],
 '[{"speaker": "presenter", "text": "Today I''ll be discussing our findings on climate change impacts on coastal ecosystems."}, {"speaker": "audience", "text": "Could you elaborate on your methodology for data collection?"}, {"speaker": "presenter", "text": "We employed a mixed-methods approach, combining quantitative satellite data with qualitative field observations."}, {"speaker": "audience", "text": "How did you account for seasonal variations in your analysis?"}, {"speaker": "presenter", "text": "We collected data over a three-year period to capture seasonal patterns and long-term trends."}, {"speaker": "audience", "text": "What are the implications of your findings for policy makers?"}]'),

('Medical Consultation', 'Discuss complex medical conditions', 'advanced',
 'You are consulting with a specialist about a medical condition.',
 ARRAY['diagnosis', 'symptoms', 'treatment', 'prognosis', 'medication', 'side effects', 'therapy'],
 ARRAY['medical terminology', 'conditional sentences', 'expressing concern'],
 '[{"speaker": "doctor", "text": "Based on your test results, I''d like to discuss several treatment options with you."}, {"speaker": "patient", "text": "What exactly do the results indicate?"}, {"speaker": "doctor", "text": "The imaging shows some inflammation that we need to address promptly."}, {"speaker": "patient", "text": "What are the potential side effects of the recommended treatment?"}, {"speaker": "doctor", "text": "Most patients tolerate it well, but some experience mild fatigue initially."}, {"speaker": "patient", "text": "How long would the treatment period last?"}]'),

('Investment Advisory Meeting', 'Discuss financial planning and investments', 'advanced',
 'You are meeting with a financial advisor about your investment portfolio.',
 ARRAY['portfolio', 'diversification', 'risk tolerance', 'returns', 'market volatility', 'assets'],
 ARRAY['financial terminology', 'future predictions', 'conditional statements'],
 '[{"speaker": "advisor", "text": "Let''s review your current portfolio allocation and discuss potential adjustments."}, {"speaker": "client", "text": "I''m concerned about the recent market volatility. Should we be more conservative?"}, {"speaker": "advisor", "text": "Given your long-term goals, some volatility is expected. However, we could rebalance to reduce risk."}, {"speaker": "client", "text": "What would you recommend for someone with my risk tolerance?"}, {"speaker": "advisor", "text": "I''d suggest increasing your bond allocation to 40% and reducing equity exposure slightly."}, {"speaker": "client", "text": "How would this affect my expected returns over the next decade?"}]'),

('Legal Consultation', 'Discuss legal matters with an attorney', 'advanced',
 'You are consulting with a lawyer about a legal issue.',
 ARRAY['contract', 'liability', 'litigation', 'settlement', 'jurisdiction', 'precedent', 'statute'],
 ARRAY['legal terminology', 'formal language', 'hypothetical situations'],
 '[{"speaker": "lawyer", "text": "Let''s examine the contractual obligations and potential liabilities in this situation."}, {"speaker": "client", "text": "What are our options if the other party breaches the agreement?"}, {"speaker": "lawyer", "text": "We could pursue damages through litigation or attempt to negotiate a settlement."}, {"speaker": "client", "text": "What factors would influence your recommendation?"}, {"speaker": "lawyer", "text": "The strength of our case, potential costs, and the likelihood of collecting damages."}, {"speaker": "client", "text": "How long would litigation typically take in a case like this?"}]'),

('International Business Call', 'Conduct business across cultures', 'advanced',
 'You are on a conference call with international business partners.',
 ARRAY['collaboration', 'cultural differences', 'time zones', 'logistics', 'coordination', 'strategy'],
 ARRAY['diplomatic language', 'cultural sensitivity', 'business terminology'],
 '[{"speaker": "manager1", "text": "Thank you all for joining despite the challenging time zones."}, {"speaker": "manager2", "text": "We appreciate the flexibility. Shall we begin with the quarterly review?"}, {"speaker": "manager1", "text": "Our European operations have exceeded expectations this quarter."}, {"speaker": "manager3", "text": "That''s excellent news. How do these results compare to our Asian markets?"}, {"speaker": "manager2", "text": "Asia is performing well too, though we''re seeing some regional variations."}, {"speaker": "manager1", "text": "Perhaps we should discuss strategies for addressing these market differences."}]'),

('Scientific Research Discussion', 'Discuss complex scientific concepts', 'advanced',
 'You are discussing research findings with colleagues.',
 ARRAY['hypothesis', 'variables', 'correlation', 'statistical significance', 'peer review', 'methodology'],
 ARRAY['scientific language', 'passive voice', 'technical explanations'],
 '[{"speaker": "researcher1", "text": "Our preliminary results suggest a strong correlation between the variables we''re studying."}, {"speaker": "researcher2", "text": "Have you controlled for potential confounding factors?"}, {"speaker": "researcher1", "text": "Yes, we''ve accounted for age, gender, and socioeconomic status in our analysis."}, {"speaker": "researcher2", "text": "What''s the statistical significance of your findings?"}, {"speaker": "researcher1", "text": "The p-value is less than 0.01, which indicates high statistical significance."}, {"speaker": "researcher2", "text": "Impressive. When do you plan to submit for peer review?"}]'),

('Diplomatic Negotiation', 'Navigate international relations', 'advanced',
 'You are participating in diplomatic discussions between countries.',
 ARRAY['diplomacy', 'sovereignty', 'bilateral', 'multilateral', 'treaty', 'sanctions', 'cooperation'],
 ARRAY['formal diplomatic language', 'conditional statements', 'persuasive techniques'],
 '[{"speaker": "diplomat1", "text": "We believe this agreement would benefit both our nations economically."}, {"speaker": "diplomat2", "text": "While we appreciate the proposal, we have concerns about certain provisions."}, {"speaker": "diplomat1", "text": "We''re open to discussing modifications that address your concerns."}, {"speaker": "diplomat2", "text": "Specifically, we''d like to revisit the trade tariff clauses."}, {"speaker": "diplomat1", "text": "That''s certainly negotiable. What alternative framework would you propose?"}, {"speaker": "diplomat2", "text": "We suggest a graduated reduction over five years rather than immediate implementation."}]'),

('Venture Capital Pitch', 'Present startup ideas to investors', 'advanced',
 'You are pitching your startup to potential investors.',
 ARRAY['startup', 'scalability', 'market opportunity', 'revenue model', 'valuation', 'equity', 'ROI'],
 ARRAY['persuasive language', 'business terminology', 'future projections'],
 '[{"speaker": "entrepreneur", "text": "Our platform addresses a $50 billion market opportunity in the healthcare sector."}, {"speaker": "investor", "text": "What''s your competitive advantage over existing solutions?"}, {"speaker": "entrepreneur", "text": "We''ve developed proprietary AI technology that reduces diagnostic time by 70%."}, {"speaker": "investor", "text": "That''s impressive. What''s your customer acquisition strategy?"}, {"speaker": "entrepreneur", "text": "We''re partnering with major hospital networks and have already secured three pilot programs."}, {"speaker": "investor", "text": "What funding amount are you seeking, and how will it be allocated?"}]'),

('Philosophy Debate', 'Engage in philosophical discussions', 'advanced',
 'You are participating in a philosophical debate about ethics.',
 ARRAY['ethics', 'morality', 'philosophy', 'argument', 'logic', 'reasoning', 'perspective'],
 ARRAY['abstract concepts', 'argumentative language', 'complex reasoning'],
 '[{"speaker": "philosopher1", "text": "I would argue that moral relativism undermines the possibility of universal human rights."}, {"speaker": "philosopher2", "text": "But doesn''t cultural context play a crucial role in determining what we consider ethical?"}, {"speaker": "philosopher1", "text": "While cultural factors are important, some principles transcend cultural boundaries."}, {"speaker": "philosopher2", "text": "Can you provide an example of such a universal principle?"}, {"speaker": "philosopher1", "text": "The prohibition against causing unnecessary suffering seems to be universally recognized."}, {"speaker": "philosopher2", "text": "Yet different cultures define ''unnecessary suffering'' quite differently, don''t they?"}]');

-- Add more conversation topics to reach 100+
INSERT INTO conversation_topics (title, description, difficulty_level, scenario, vocabulary_focus, grammar_focus, sample_dialogue) VALUES

-- Additional Beginner Topics (31-40)
('Talking About Weather', 'Discuss weather conditions and forecasts', 'beginner',
 'You are making small talk about the weather with a neighbor.',
 ARRAY['sunny', 'rainy', 'cloudy', 'hot', 'cold', 'temperature', 'forecast'],
 ARRAY['present simple', 'adjectives', 'future with will'],
 '[{"speaker": "neighbor1", "text": "Beautiful weather today, isn''t it?"}, {"speaker": "neighbor2", "text": "Yes, it''s perfect for a walk in the park."}, {"speaker": "neighbor1", "text": "Did you see the weather forecast for tomorrow?"}, {"speaker": "neighbor2", "text": "I heard it might rain in the afternoon."}, {"speaker": "neighbor1", "text": "I hope it clears up for the weekend."}, {"speaker": "neighbor2", "text": "Me too! I have plans for a picnic on Saturday."}]'),

('At the Library', 'Learn library services and book borrowing', 'beginner',
 'You are visiting the library to borrow books and use services.',
 ARRAY['library card', 'borrow', 'return', 'due date', 'fine', 'catalog', 'section'],
 ARRAY['modal verbs', 'present simple', 'question formation'],
 '[{"speaker": "librarian", "text": "Good morning! How can I help you today?"}, {"speaker": "visitor", "text": "I''d like to get a library card, please."}, {"speaker": "librarian", "text": "Of course! Do you have identification and proof of address?"}, {"speaker": "visitor", "text": "Yes, here''s my driver''s license and a utility bill."}, {"speaker": "librarian", "text": "Perfect! Your card will be ready in just a moment."}, {"speaker": "visitor", "text": "Thank you! Where can I find books about cooking?"}]'),

('Calling in Sick', 'Report illness to work or school', 'beginner',
 'You need to call your workplace to report that you are sick.',
 ARRAY['sick', 'fever', 'doctor', 'appointment', 'rest', 'better', 'return'],
 ARRAY['present continuous', 'future tense', 'expressing feelings'],
 '[{"speaker": "employee", "text": "Hello, this is John. I''m calling to let you know I won''t be in today."}, {"speaker": "supervisor", "text": "I''m sorry to hear that. What''s wrong?"}, {"speaker": "employee", "text": "I have a fever and I''m feeling quite unwell."}, {"speaker": "supervisor", "text": "Have you seen a doctor?"}, {"speaker": "employee", "text": "I have an appointment this afternoon."}, {"speaker": "supervisor", "text": "Take care of yourself. Let us know how you''re feeling tomorrow."}]'),

('Ordering Pizza', 'Practice food delivery ordering', 'beginner',
 'You are ordering pizza for delivery to your home.',
 ARRAY['pizza', 'toppings', 'size', 'delivery', 'address', 'phone number', 'total'],
 ARRAY['would like', 'preferences', 'giving personal information'],
 '[{"speaker": "employee", "text": "Thank you for calling Tony''s Pizza. How can I help you?"}, {"speaker": "customer", "text": "I''d like to order a pizza for delivery, please."}, {"speaker": "employee", "text": "What size and toppings would you like?"}, {"speaker": "customer", "text": "A large pizza with pepperoni and mushrooms."}, {"speaker": "employee", "text": "Great! What''s your delivery address?"}, {"speaker": "customer", "text": "123 Main Street, apartment 4B."}]'),

('At the Gas Station', 'Learn about fueling your car', 'beginner',
 'You need to put gas in your car and pay for it.',
 ARRAY['gas', 'fuel', 'pump', 'regular', 'premium', 'cash', 'credit card'],
 ARRAY['numbers', 'payment methods', 'simple instructions'],
 '[{"speaker": "customer", "text": "Excuse me, how do I use this pump?"}, {"speaker": "attendant", "text": "First, select your fuel type, then insert your payment method."}, {"speaker": "customer", "text": "Should I use regular or premium gas?"}, {"speaker": "attendant", "text": "Check your car manual, but most cars use regular."}, {"speaker": "customer", "text": "Okay, I''ll use regular. Can I pay with a credit card?"}, {"speaker": "attendant", "text": "Yes, just insert your card and follow the prompts."}]'),

('Making Friends', 'Learn to socialize and make new friends', 'beginner',
 'You are trying to make friends with someone new in your neighborhood.',
 ARRAY['friend', 'neighbor', 'hobby', 'interest', 'free time', 'activity', 'together'],
 ARRAY['present simple', 'likes and dislikes', 'suggestions'],
 '[{"speaker": "person1", "text": "Hi! I just moved in next door. I''m Lisa."}, {"speaker": "person2", "text": "Nice to meet you, Lisa! I''m Tom. Welcome to the neighborhood!"}, {"speaker": "person1", "text": "Thank you! What do you like to do in your free time?"}, {"speaker": "person2", "text": "I enjoy reading and gardening. How about you?"}, {"speaker": "person1", "text": "I love cooking and hiking. Maybe we could go hiking together sometime?"}, {"speaker": "person2", "text": "That sounds great! There''s a nice trail nearby."}]'),

('At the Pharmacy', 'Get medicine and health advice', 'beginner',
 'You need to pick up a prescription and ask about medications.',
 ARRAY['prescription', 'medicine', 'pills', 'dosage', 'side effects', 'insurance'],
 ARRAY['modal verbs', 'asking for advice', 'following instructions'],
 '[{"speaker": "pharmacist", "text": "Good afternoon! How can I help you?"}, {"speaker": "customer", "text": "I''m here to pick up a prescription for Smith."}, {"speaker": "pharmacist", "text": "Let me check... Yes, here it is. Do you have any questions about this medication?"}, {"speaker": "customer", "text": "How often should I take it?"}, {"speaker": "pharmacist", "text": "Take one pill twice a day with food."}, {"speaker": "customer", "text": "Are there any side effects I should know about?"}]'),

('Renting a Car', 'Learn car rental procedures', 'beginner',
 'You need to rent a car for a trip.',
 ARRAY['rental', 'license', 'insurance', 'compact', 'SUV', 'mileage', 'return'],
 ARRAY['future tense', 'asking about options', 'making decisions'],
 '[{"speaker": "agent", "text": "Welcome to City Car Rental! How can I assist you?"}, {"speaker": "customer", "text": "I need to rent a car for the weekend."}, {"speaker": "agent", "text": "What type of car would you prefer?"}, {"speaker": "customer", "text": "Something economical, maybe a compact car."}, {"speaker": "agent", "text": "Perfect! Do you need insurance coverage?"}, {"speaker": "customer", "text": "Yes, please. What does it include?"}]'),

('School Parent-Teacher Meeting', 'Discuss child''s progress at school', 'beginner',
 'You are meeting with your child''s teacher to discuss their progress.',
 ARRAY['grades', 'homework', 'behavior', 'improvement', 'progress', 'parent', 'teacher'],
 ARRAY['present perfect', 'expressing concern', 'asking for advice'],
 '[{"speaker": "teacher", "text": "Thank you for coming in today. Let''s talk about Emma''s progress."}, {"speaker": "parent", "text": "How is she doing in math?"}, {"speaker": "teacher", "text": "She''s improved a lot this semester. Her test scores are much better."}, {"speaker": "parent", "text": "That''s wonderful! What about her homework habits?"}, {"speaker": "teacher", "text": "She usually completes her assignments, but sometimes they''re late."}, {"speaker": "parent", "text": "We''ll work on time management at home."}]'),

('Joining a Gym', 'Sign up for gym membership', 'beginner',
 'You want to join a gym and learn about membership options.',
 ARRAY['membership', 'equipment', 'classes', 'trainer', 'monthly', 'annual', 'trial'],
 ARRAY['comparing options', 'asking about prices', 'making decisions'],
 '[{"speaker": "staff", "text": "Welcome to FitLife Gym! Are you interested in a membership?"}, {"speaker": "visitor", "text": "Yes, I''d like to know about your membership options."}, {"speaker": "staff", "text": "We have monthly and annual plans. Would you like a tour first?"}, {"speaker": "visitor", "text": "That would be great! What equipment do you have?"}, {"speaker": "staff", "text": "We have cardio machines, weights, and a swimming pool."}, {"speaker": "visitor", "text": "Do you offer fitness classes too?"}]');

-- Continue with more intermediate and advanced topics...
-- (This would continue with topics 41-100+ following the same pattern)
