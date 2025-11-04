const canvas = document.getElementById('canvas'); // Get the canvas element from the HTML
const ctx = canvas.getContext('2d'); // Get the 2D drawing context for the canvas
const generateBtn = document.getElementById('generateBtn'); // Get the "Generate" button element
const seedInput = document.getElementById('seed'); // Get the input field where the user enters a seed

function hashSeed(seed) { // Function to turn the seed string into a numeric hash
  let hash = 0; // Initialize the hash value
  for (let i = 0; i < seed.length; i++) { // Loop through each character in the seed
    hash = seed.charCodeAt(i) + ((hash << 5) - hash); // Update hash using bitwise operations
  }
  return hash >>> 0; // Return a non-negative integer hash (unsigned right shift)
}

function hashToColor(hash) { // Convert the hash into an RGB color
  const r = (hash & 0xFF0000) >> 16; // Extract the red component from the hash
  const g = (hash & 0x00FF00) >> 8;  // Extract the green component from the hash
  const b = hash & 0x0000FF;         // Extract the blue component from the hash
  return `rgb(${r}, ${g}, ${b})`;    // Return as an RGB string
}

function generateCustomFlower() { // Generate flower parameters based on the seed input
  const seedValue = seedInput.value.trim(); // Get and trim the seed input
  if (!seedValue) { // If the input is empty, show an alert
    alert("Please enter a seed word or number.");
    return; // Exit the function
  }

  const hash = hashSeed(seedValue); // Hash the seed to get a numeric value
  const depth = (hash % 4) + 2; // Set depth between 2 and 5
  const petals = (hash % 6) + 6; // Set number of petals between 6 and 11
  const color = hashToColor(hash); // Convert the hash into a color

  drawFlower(depth, petals, color); // Call the function to draw the flower
}

function drawFlower(depth, petals, color) { // Draw the flower on the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  const centerX = canvas.width / 2; // X-coordinate of the flower's center
  const centerY = canvas.height / 2; // Y-coordinate of the flower's center
  const radius = 200; // Radius of the flower

  ctx.strokeStyle = color; // Set the stroke color
  ctx.lineWidth = 1.5; // Set the line width

  ctx.beginPath(); // Start a new drawing path

  for (let i = 0; i < petals; i++) { // Loop through each petal
    const angle = (2 * Math.PI / petals) * i; // Calculate angle for this petal

    const p1 = { x: centerX, y: centerY }; // Starting point at center
    const p2 = { // Endpoint of first edge
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };

    drawKochEdge(p1, p2, depth); // Draw fractal edge from center to petal tip

    const controlAngle = angle + Math.PI / petals; // Midpoint angle between petals
    const p3 = { // Control point for the second and third edge
      x: centerX + radius * 0.6 * Math.cos(controlAngle),
      y: centerY + radius * 0.6 * Math.sin(controlAngle),
    };

    drawKochEdge(p2, p3, depth); // Draw fractal edge from tip to side
    drawKochEdge(p3, p1, depth); // Draw back to center
  }

  ctx.stroke(); // Render all the lines drawn in the path
}

function drawKochEdge(p1, p2, depth) { // Draw one edge of a Koch fractal
  if (depth === 0) { // Base case: just draw a straight line
    ctx.moveTo(p1.x, p1.y); // Move to starting point
    ctx.lineTo(p2.x, p2.y); // Draw line to ending point
    return; // End recursion
  }

  const dx = (p2.x - p1.x) / 3; // Divide the segment into thirds
  const dy = (p2.y - p1.y) / 3;

  const pa = { x: p1.x + dx, y: p1.y + dy }; // First third point
  const pb = { x: p1.x + 2 * dx, y: p1.y + 2 * dy }; // Second third point

  const angle = Math.PI / 3; // 60 degrees in radians
  const mx = pb.x - pa.x; // Horizontal vector between pa and pb
  const my = pb.y - pa.y; // Vertical vector between pa and pb

  // Rotate the vector to get the tip of the "bump"
  const px = pa.x + mx * Math.cos(-angle) - my * Math.sin(-angle);
  const py = pa.y + mx * Math.sin(-angle) + my * Math.cos(-angle);
  const pc = { x: px, y: py }; // Tip of the triangle "bump"

  // Recursively draw the four new edges
  drawKochEdge(p1, pa, depth - 1); // First segment
  drawKochEdge(pa, pc, depth - 1); // Left side of the bump
  drawKochEdge(pc, pb, depth - 1); // Right side of the bump
  drawKochEdge(pb, p2, depth - 1); // Last segment
}

// Initial default flower drawn when the page loads
drawFlower(3, 8, 'purple'); // Depth 3, 8 petals, color purple

generateBtn.addEventListener('click', generateCustomFlower); // When button is clicked, generate flower

seedInput.addEventListener('keydown', (e) => { // When Enter key is pressed in the input
  if (e.key === 'Enter') generateCustomFlower(); // Generate flower
});

