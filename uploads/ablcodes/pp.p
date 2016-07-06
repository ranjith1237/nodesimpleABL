/* Test program (pp.p) */
DEF VAR c AS CHAR.
DEF VAR i AS INT.
Output to pp.out append. 
c = SESSION:PARAMETER.
DISPLAY "The parameter is:" SKIP 
c FORMAT "X(70)" SKIP
"The number of entries is:" NUM-ENTRIES(c).
REPEAT i = 1 TO NUM-ENTRIES(c):
   MESSAGE  "Entry: " I " is " ENTRY(I, c).
END.
QUIT.
