  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimeRemaining, 1000);
  }
 
  function updateTimeRemaining() {
    timeRemaining--;
    updateTimerDisplay();
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      alert("Time's up! You lose.");
      // You can add any additional logic here for what happens when time runs out
    }
  }
 
  function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById("time-remaining").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function getLocation() {
    startTimer(); // Start or restart the timer when getting the location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
 

function showPosition(position) {
    const userLatitude = position.coords.latitude;
    const userLongitude = position.coords.longitude;
    const radiusInKm = 0.1; // Adjust this value based on your desired accuracy
    const location = locations[currentLocationIndex];
    const distance = calculateDistance(userLatitude, userLongitude, location.latitude, location.longitude);
    if (distance <= radiusInKm) {
      currentLocationIndex++;
      updateProgress(25); // Increase progress by 25% for each completed task
      currentClue = locations[currentLocationIndex].clue;
      document.getElementById("hint").style.display = "none"; // Hide hint if task completed
      document.getElementById("pebbles-earned").style.display = "block"; // Display pebbles earned
      const pebblesEarned = calculatePebblesEarned();
      totalPebblesEarned += pebblesEarned;
      document.getElementById("pebbles-earned").textContent = `Pebbles earned: ${totalPebblesEarned} (during the last round you have earned: ${pebblesEarned})`;
      alert("You got it! Follow the clue: " + currentClue);
      timeRemaining = timeLimitInSeconds; // Reset time limit for the next task
      updateTimerDisplay(); // Update the displayed timer
    } else {
      alert("You're not quite there yet. Keep searching!" + `Your location: ${userLatitude}, ${userLongitude}`);
    }
    document.getElementById("clue").innerHTML = currentClue;
    if (currentLocationIndex === locations.length) {
      currentClue = "Congratulations! You finished the hunt!";
    }
  }

  function showHint() {
    const hint = locations[currentLocationIndex].hint;
    document.getElementById("hint").innerHTML = "Hint: " + hint;
    document.getElementById("hint").style.display = "block";
  }
 
  function updateProgress(percent) {
    const progressBar = document.getElementById("progress-bar");
    let currentWidth = parseFloat(progressBar.style.width) || 0;
    let newWidth = currentWidth + percent;
    progressBar.style.width = newWidth + "%";
    progressBar.textContent = Math.round(newWidth) + "%";
  }
 
  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      default:
        alert("An unknown error occurred.");
    }
  }
 
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = radians(lat2 - lat1);
    const dLon = radians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(radians(lat1)) * Math.cos(radians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }
 
  function radians(degrees) {
    return degrees * Math.PI / 180;
  }
 
  // Function to calculate pebbles earned based on time remaining
  function calculatePebblesEarned() {
    const pebblesPerMinute = 10; // Adjust this value as needed
    const minutesRemaining = timeRemaining / 60;
    return Math.round(minutesRemaining * pebblesPerMinute);
  }
 
  function confirmHint() {
    if (confirm("Pressing this button will reduce the time by 3 minutes. Are you sure that you want to press this button?") && timeRemaining>=180) {
      showHint()
      document.getElementById("hint").style.display = "block";
      timeRemaining -= 180; // Reduce time by 2 minutes (2 * 60 seconds)
      updateTimerDisplay(); // Update the displayed timer
    }else{
      alert("Not enough time(")
    }
  }