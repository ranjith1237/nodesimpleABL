
/* ***************************  Definitions  ************************** */
DEFINE VARIABLE custId AS INTEGER NO-UNDO.
DEFINE VARIABLE thisCust AS CHARACTER NO-UNDO.

custId = DECIMAL(SESSION:PARAMETER).

/* ********************  Preprocessor Definitions  ******************** */
DEFINE VARIABLE lcJSON AS LONGCHAR NO-UNDO.
DEFINE TEMP-TABLE custRecord LIKE Customer.  

/* ***************************  Main Block  *************************** */

FIND FIRST Customer WHERE Customer.CustNum = custId NO-ERROR.
IF AVAILABLE Customer THEN DO:
    CREATE custRecord.
    BUFFER-COPY Customer TO custRecord.
    TEMP-TABLE custRecord:WRITE-JSON ("LONGCHAR", lcJSON, TRUE, ?, ?, FALSE,?).
    thisCust = lcJSON.
END.
ELSE 
    thisCust = "[ ERROR: Customer " + STRING(custId) + " not found]".
    
output to node_getCustomer.out.   
MESSAGE thisCust.
output close.



