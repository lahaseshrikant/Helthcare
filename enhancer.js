function getEnhancedSuggestions(symptoms) {
    const enhancedSuggestions = symptoms.map(symptom => {
      let enhancedSymptom = symptom;

      if (symptom.includes('headache')) {
        enhancedSymptom = enhanceHeadache(symptom);
      } else if (symptom.includes('nausea')) {
        enhancedSymptom = enhanceNausea(symptom);
      } else if (symptom.includes('fever')) {
        enhancedSymptom = enhanceFever(symptom);
      } else {
        enhancedSymptom = `Enhanced ${symptom}`;
      }
  
      return enhancedSymptom;
    });
  
    return enhancedSuggestions;
  }

  function enhanceHeadache(symptom) {
    return `Severe ${symptom}`;
  }
  
  function enhanceNausea(symptom) {
    return `Intense ${symptom}`;
  }
  
  function enhanceFever(symptom) {
    return `High ${symptom}`;
  }
  
  module.exports = { getEnhancedSuggestions };
  