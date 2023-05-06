#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 20, 4); // set the LCD address to 0x27 for a 16 chars and 2 line display

char degree[] = {
    0x06,
    0x09,
    0x09,
    0x06,
    0x00,
    0x00,
    0x00,
    0x00};

char tempLogo[] = {
    0x0E,
    0x0A,
    0x0A,
    0x0A,
    0x0E,
    0x1F,
    0x1F,
    0x0E};

void lcd_print(float roomTemp, String ACtemp);

void setup()
{
    lcd.init();
    lcd.createChar(0, degree);
    lcd.createChar(1, tempLogo);
    lcd.home();
    // Print a message to the LCD.
    lcd.backlight();
    lcd_print(17, "17m");
}

void loop()
{
}

void lcd_print(float roomTemp, String ACtemp)
{
    lcd.setCursor(0, 1);
    lcd.print("Room ");
    lcd.write(1);
    lcd.print(":");
    lcd.print(roomTemp);
    lcd.write(0);
    lcd.print("C");

    String acTemp = "";
    String acCmd = "";

    acTemp += ACtemp[0];
    acTemp += ACtemp[1];

    acCmd += ACtemp[2];

    lcd.setCursor(0, 0);
    lcd.print("AC   ");
    lcd.write(1);
    lcd.print(":");
    lcd.print(acTemp);
    lcd.write(0);
    lcd.print("C");

    lcd.setCursor(0, 3);
    lcd.print("AC Mode:");
    if (acCmd == "l")
    {
        lcd.print("LOW");
    }
    else if (acCmd == "m")
    {
        lcd.print("MEDIUM");
    }
    else if (acCmd == "h")
    {
        lcd.print("HIGH");
    }
}
