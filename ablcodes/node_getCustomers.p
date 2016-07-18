DEFINE VARIABLE qh AS WIDGET-HANDLE.
DEFINE VARIABLE numvar AS INTEGER INITIAL 10.
CREATE QUERY qh.
DEFINE TEMP-TABLE custRecord LIKE Customer.

DEFINE VARIABLE filter as CHAR.

DEFINE VARIABLE text-memptr AS MEMPTR NO-UNDO.
 
COPY-LOB FROM FILE SESSION:PARAMETER TO text-memptr.
filter = GET-STRING(text-memptr,1).

filter = REPLACE(filter, "eq", "=").
filter = REPLACE(filter, "n=", "<>").
filter = REPLACE(filter, "lt", "<").
filter = REPLACE(filter, "<e", "<=").
filter = REPLACE(filter, "gt", ">").
filter = REPLACE(filter, ">e", ">=").

message filter view-as alert-box.
qh:SET-BUFFERS(BUFFER customer:HANDLE).
qh:QUERY-PREPARE("FOR EACH customer WHERE " + filter).
qh:QUERY-OPEN.
output to node_getCustomers.out APPEND.
REPEAT:
    qh:GET-NEXT().
    IF qh:QUERY-OFF-END THEN LEAVE.
    BUFFER-COPY Customer TO custRecord.
    TEMP-TABLE custRecord:WRITE-JSON ("file", "node_getCustomers.out",
              TRUE,?,?,TRUE,?).
END.
qh:QUERY-CLOSE().
DELETE OBJECT qh. 
output close. 

/* WRITE-JSON ( target-type
  , { file | stream | stream-handle | memptr | longchar }
  [ , formatted [ , encoding [ , omit-initial-values  
  [ , omit-outer-object [ , write-before-image ] ] ] ] ] ) */


