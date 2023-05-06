#include <IRsend.h>
// Codes are in Global Cache format less the emitter ID and request ID.
// These codes can be found in GC's Control Tower database.
uint16_t rawDataonnew[] = {3240, 1536, 452, 344, 452, 1136, 452, 340, 452, 344, 452, 1136, 452, 340, 456, 1136, 448, 344, 452, 344, 452, 1136, 452, 1136, 452, 1136, 452, 344, 452, 1136, 452, 344, 452, 1136, 452, 1136, 452, 1136, 452, 344, 452, 340, 452, 344, 452, 340, 452, 1140, 448, 1140, 452, 340, 476, 1116, 476, 1112, 452, 340, 476, 320, 452, 1136, 452, 340, 456, 340, 452, 1136, 452, 344, 456, 336, 456, 1136, 476, 1112, 452, 340, 456, 1136, 452, 1136, 476, 1112, 480, 1108, 476, 1112, 476, 1112, 480, 1112, 476, 1112, 452, 1136, 452, 340, 452, 344, 476, 320, 448, 344, 476, 320, 452, 340, 476, 320, 476, 320, 472, 1116, 460, 1128, 452, 1136, 476, 1112, 476, 320, 448, 348, 472, 1092, 496, 1092, 496, 324, 472, 320, 476, 320, 472, 320, 472, 1092, 500, 1088, 500, 300, 472, 320, 496, 1092, 496, 300, 492, 1096, 496, 1092, 496, 1092, 496, 1092, 468, 1124, 464, 328, 468, 1120, 468, 1124, 464, 328, 468, 328, 464, 328, 464, 332, 464, 332, 460, 1128, 460, 332, 464};
IRsend irsend(25); // an IR emitter led is connected to GPIO pin 4
void setup()
{
    irsend.begin();
    Serial.begin(115200);
}
void loop()
{
    Serial.println("Toggling power");
    irsend.sendRaw(rawDataonnew, sizeof(rawDataonnew) / sizeof(rawDataonnew[0]), 38);
    delay(1000);
}