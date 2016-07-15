DEFINE VARIABLE custId AS INTEGER NO-UNDO.
output to node_delCustomer.out.
FOR EACH Customer WHERE Customer.CustNum EQ custId:
    IF AVAILABLE Customer THEN 
    DO:
        DELETE Customer.
        message custId " is deleted".
    END.
END.
output close.
