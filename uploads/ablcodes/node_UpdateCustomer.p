

/* ***************************  Definitions  ************************** */
DEFINE VARIABLE custId AS INTEGER NO-UNDO.
DEFINE VARIABLE thisCustFile AS CHARACTER NO-UNDO.

DEFINE VARIABLE c AS CHARACTER.
DEFINE VARIABLE i AS INT.
c = SESSION:PARAMETER.
output to node_UpdateCustomer.out . 

REPEAT i = 1 TO NUM-ENTRIES(c):
   Message i ENTRY(i, c).
   IF i EQ 1 THEN 
   DO:
	custId = INTEGER(ENTRY(i, c)).
    END.
    ELSE
        thisCustFile = ENTRY(i, c).
END.

/* ********************  Preprocessor Definitions  ******************** */
DEFINE TEMP-TABLE custRecord LIKE Customer.
DEFINE VARIABLE lRetOK AS LOGICAL NO-UNDO.

/* ***************************  Main Block  *************************** */
FIND FIRST Customer WHERE Customer.CustNum = custId NO-ERROR.
IF AVAILABLE Customer THEN DO:
    CREATE custRecord.

    lRetOK = TEMP-TABLE custRecord:READ-JSON("file", thisCustFile, "EMPTY").
    FIND FIRST custRecord.
    IF lRetOK THEN 
        BUFFER-COPY custRecord TO Customer.
    MESSAGE "Update for customer " custId " successful".
    
END. 
  
output close.
