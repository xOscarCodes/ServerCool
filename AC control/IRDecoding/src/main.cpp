#include <Arduino.h>
#include <IRLibSendBase.h> //We need the base code
#include <IRLib_HashRaw.h> //Only use raw sender

IRsendRaw mySender;

#define maxLen 800
#define rxPinIR 2
int lengths = 0;

int n = 0;
volatile unsigned int irBuffer[maxLen];
volatile unsigned int x = 0;

void setup()
{

  int m;
  Serial.begin(115200);

  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(4, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(rxPinIR), rxIR_Interrupt_Handler, CHANGE);
  Serial.println(F("INSTRUCTIONS: "));
  Serial.println(F("1. There are two buttons on the PCB: a right button to start decoding and a left button to verify the decoded signal."));
  Serial.println(F("2. To start decoding, press the right button on the PCB once."));
  Serial.println(F("3. Use the remote control of your AC or device to send the signal that you want to decode."));
  Serial.println(F("4. The decoded signal will appear on the monitor as array elements. Once all the array elements have appeared, the decoding process will automatically stop."));
  Serial.println(F("5. To verify if the signal is working correctly, press and hold the left button on the PCB for a 10 seconds"));
  Serial.println(F("6. If AC beeps the signal decoded is 'ok' Copy all elemets and name it accordingly for further setup, otherwise deode the same signal again"));
  Serial.println(F("7. Remember to decode the signal for each temperature with different fan speed. For example, for temperature 17, you will need to decode three signals: temp-17::fan-high, temp-17::fan:medium, and temp-17::fan-low."));
  Serial.println(F("8. now to start decoding press right button."));
  Serial.println(F(""));
  Serial.println(F(""));
}

void loop()
{

  if (digitalRead(5) == HIGH)
    n = 1;

  if (n == 1)
  {
    Serial.println(F("Press button from AC remote(once only)"));
    delay(2000);
  }

  if (digitalRead(4) == HIGH)
  {
    n = 0;
    Serial.print(F("sending__signal--------"));
    mySender.send(irBuffer, lengths, 38);

    delay(1000);
  }

  if (x)
  {
    digitalWrite(LED_BUILTIN, HIGH);
    Serial.println();
    Serial.print(F("Raw: ("));
    Serial.print(x - 1);
    Serial.print(F(")"));
    lengths = (x - 1);
    detachInterrupt(digitalPinToInterrupt(rxPinIR));

    for (int i = 1; i < x; i++)
    {
      irBuffer[i - 1] = irBuffer[i] - irBuffer[i - 1];
      Serial.print(irBuffer[i - 1]);
      if (i != x - 1)
        Serial.print(F(", "));
    }

    x = 0;
    Serial.println(F(""));
    digitalWrite(LED_BUILTIN, LOW);                                                  // end of visual indicator, for this time
    attachInterrupt(digitalPinToInterrupt(rxPinIR), rxIR_Interrupt_Handler, CHANGE); // re-enable ISR for receiving IR signal
    n = 0;
  }
}

void rxIR_Interrupt_Handler()
{
  if (n == 1)
  {
    if (x > maxLen)
      return;                 // ignore if irBuffer is already full
    irBuffer[x++] = micros(); // just continually record the time-stamp of signal transitions
  }
}