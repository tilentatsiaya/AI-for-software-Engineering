# pip install spacy
import spacy

# Load English NLP model
nlp = spacy.load("en_core_web_sm")

# Sample Amazon Product Reviews
reviews = [
    "I love my LED lights, they are brighter and functional",
    "The camera is amazing. It exceeded my expectations",
    "The waist trainer is just ok, nothing extraordinary about it",
    "The torch's quality is poor, it looks like a toy"
]

# Defining simple positive, negative, and neutral words
positive_words = ["love", "amazing", "exceeded", "brighter", "functional"]
negative_words = ["poor", "toy"]
neutral_words = ["ok", "ordinary"]

# Sentiment analysis function
def analyse_sentiment(text):
    text_lower = text.lower()
    pos_count = sum(word in text_lower for word in positive_words)
    neg_count = sum(word in text_lower for word in negative_words)
    neu_count = sum(word in text_lower for word in neutral_words)

    if pos_count > neg_count:
        return "positive"
    elif neg_count > pos_count:
        return "negative"
    else:
        return "neutral"

# Process each review
for review in reviews:
    doc = nlp(review)
    entities = [(ent.text, ent.label_) for ent in doc.ents if ent.label_ in ["ORG", "PRODUCT"]]
    sentiment = analyse_sentiment(review)

    print(f"Review: {review}")
    print(f"Sentiment: {sentiment}")
    print(f"Named Entities: {entities if entities else 'None'}")
    print("-" * 70)
