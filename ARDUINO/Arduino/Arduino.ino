#define E1 10  // Enable Pin for motor 1
#define E2 11  // Enable Pin for motor 2

#define I1 8  // Control pin 1 for motor 1
#define I2 9  // Control pin 2 for motor 1

#define I3 12  // Control pin 1 for motor 2
#define I4 13  // Control pin 2 for motor 2

int TRIG = 2;    
int ECHO = 3;   
long tiempo = 0;
long distancia = 0;
int minDis=40;


void setup() {

    pinMode(E1, OUTPUT);
    pinMode(E2, OUTPUT);

    pinMode(I1, OUTPUT);
    pinMode(I2, OUTPUT);
    pinMode(I3, OUTPUT);
    pinMode(I4, OUTPUT);

    pinMode(TRIG, OUTPUT);    
   pinMode(ECHO, INPUT);    
   Serial.begin(115200);  
}

void startEngines(){
   digitalWrite(E1, HIGH);
   digitalWrite(E2, HIGH);
}

void stopEngines(){
   digitalWrite(E1, LOW);
   digitalWrite(E2, LOW);
}

void forward(){
   //Motor 1
   digitalWrite(I1, LOW);
   digitalWrite(I2, HIGH);
   //Motor 2
   digitalWrite(I3, LOW);
   digitalWrite(I4, HIGH);
}

void backward(){
  //Motor 1
   digitalWrite(I1, HIGH);
   digitalWrite(I2, LOW);
   //Motor 2
   digitalWrite(I3, HIGH);
   digitalWrite(I4, LOW);
}

void turnLeft(){
    digitalWrite(I3, LOW);
    digitalWrite(I4, LOW);   
}

void turnRight(){
    digitalWrite(I1, LOW);
    digitalWrite(I2, LOW);  
}



void loop() {

  if(Serial.available()>0){
    String leido=Serial.readStringUntil('\n');
    //Serial.println(leido.substring(0,4));
    if (leido.substring(0,4) == "dis:") {
      //Serial.println(leido.substring(4));
      minDis=leido.substring(4).toInt();
      //Serial.println(minDis);
    }    
   }
  
    digitalWrite(TRIG, LOW);
    delayMicroseconds(5);
    digitalWrite(TRIG, HIGH);    //envia una señal de ultrasonido
    tiempo = pulseIn(ECHO, HIGH);  //recibe el rebote
    tiempo = tiempo / 2;   //obtiene el tiempo de ida
    distancia = (int) (0.034 * tiempo);  //utiliza la velocidad del sonido en segundos para calcular la distancia 

    startEngines();
    //forward();

    Serial.println(distancia);

    if(distancia > minDis){
        forward();
        //turnLeft();
        //delay(1000);
        //forward();
        //stopEngines();
        //delay(500);
    }else{
        stopEngines();
        /*if(distancia >10){
        turnRight();
        //delay(1000);
        //forward();
        //stopEngines();
        //delay(500);
        }else{
          stopEngines();
        }*/
    }   

}
