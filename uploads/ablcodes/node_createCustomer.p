DEFINE VARIABLE custId AS INTEGER NO-UNDO.
DEFINE VARIABLE thisCustFile AS CHARACTER NO-UNDO.

output to node_createCustomer.out . 

thisCustFile = SESSION:PARAMETER.


/* ********************  Preprocessor Definitions  ******************** */
DEFINE TEMP-TABLE custRecord LIKE Customer.
DEFINE VARIABLE lcJSON AS LONGCHAR NO-UNDO.
DEFINE VARIABLE lRetOK AS LOGICAL NO-UNDO.

/* ***************************  Main Block  *************************** */
CREATE Customer.
lRetOK = TEMP-TABLE custRecord:READ-JSON ("file", thisCustFile, "EMPTY").
FIND FIRST custRecord.
IF lRetOK THEN DO:
    BUFFER-COPY custRecord EXCEPT custNum TO Customer.
    BUFFER-COPY Customer TO custRecord.
   TEMP-TABLE custRecord:WRITE-JSON ("file", "node_createCustomer.out", TRUE).
END.
output close.    
