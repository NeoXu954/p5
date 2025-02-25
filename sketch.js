// 球体容器参数
let containerRadius = 300;
let rotationX = 0;
let rotationY = 0;
let rotationSpeed = 0.003;

// 小球数组
let balls = [];
const numBalls = 100;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);
  
  // 创建小球
  for (let i = 0; i < numBalls; i++) {
    // 随机位置（在球体内）
    let r = random(0, containerRadius * 0.9);
    let theta = random(0, PI);
    let phi = random(0, TWO_PI);
    
    let x = r * sin(theta) * cos(phi);
    let y = r * sin(theta) * sin(phi);
    let z = r * cos(theta);
    
    // 随机速度
    let speed = random(1, 3);
    let direction = p5.Vector.random3D();
    let velocity = direction.mult(speed);
    
    // 随机大小和颜色
    let radius = random(5, 15);
    let hue = random(360);
    
    balls.push(new Ball(x, y, z, velocity, radius, hue));
  }
}

function draw() {
  background(0);
  
  // 环境光和材质设置
  ambientLight(50);
  pointLight(255, 255, 255, 0, 0, 300);
  
  // 旋转容器
  rotationX += rotationSpeed;
  rotationY += rotationSpeed * 0.7;
  
  push();
  rotateX(rotationX);
  rotateY(rotationY);
  
  // 绘制透明容器球体
  noFill();
  stroke(255, 30);
  strokeWeight(1);
  sphere(containerRadius);
  
  // 更新和显示所有小球
  for (let ball of balls) {
    ball.update();
    ball.checkCollision();
    ball.display();
  }
  
  pop();
}

class Ball {
  constructor(x, y, z, velocity, radius, hue) {
    this.position = createVector(x, y, z);
    this.velocity = velocity;
    this.radius = radius;
    this.hue = hue;
    this.trail = []; // 存储轨迹点
    this.maxTrailLength = 20; // 轨迹最大长度
  }
  
  update() {
    // 更新位置
    this.position.add(this.velocity);
    
    // 添加当前位置到轨迹
    this.trail.push(createVector(this.position.x, this.position.y, this.position.z));
    
    // 限制轨迹长度
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
  }
  
  checkCollision() {
    // 检测与容器球体的碰撞
    let distanceFromCenter = this.position.mag();
    
    if (distanceFromCenter + this.radius > containerRadius) {
      // 计算碰撞后的反弹方向
      let normal = this.position.copy().normalize();
      
      // 调整位置，防止球体穿出容器
      let correction = containerRadius - (distanceFromCenter + this.radius);
      this.position.add(normal.mult(correction));
      
      // 计算反弹后的速度（反射）
      let dot = this.velocity.dot(normal);
      this.velocity.sub(normal.mult(2 * dot));
      
      // 添加一点随机性，使运动更自然
      this.velocity.add(p5.Vector.random3D().mult(0.1));
    }
  }
  
  display() {
    // 绘制轨迹
    noFill();
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length - 1, 0, 80);
      stroke(this.hue, 80, 100, alpha);
      strokeWeight(this.radius * 0.5);
      vertex(this.trail[i].x, this.trail[i].y, this.trail[i].z);
    }
    endShape();
    
    // 绘制小球
    push();
    translate(this.position.x, this.position.y, this.position.z);
    noStroke();
    fill(this.hue, 80, 100, 80);
    sphere(this.radius);
    pop();
  }
}

// 窗口大小调整时重置画布
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
} 
