<?php
            if(isset($_POST['submit']))
            {
           $first_name = $_POST['first_name'];                                        //Here we have the name of the sender as well as the mail. We give them new variabel name.
            $from = $_POST['email']; 
            
            $to = "alal1700@student.miun.se, mahe1711@student.miun.se";  // Where the message is going to go to. 
            
            $subject = "Form submission";                                             //information for the sender and for the receiver. 
            $subject1 = "Here is what you have send to us ";
            $message = $first_name . "  frågar följande:" . "\n\n" . $_POST['message'];
            $message1 = "Here is a copy of what you have sent to us" . $first_name . "\n\n" . $_POST['message'];

            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

            $headers = "From:" . $from;
            $headers1 = "From:" . $to;
            if(mail($to,$subject,$message,$headers)){                                    //pop-out when the sender sends the message. 
            echo "<script>
                    alert('Your mail has been sent successfully, We will reach you as fast as we can.');
                </script>";
                mail($from,$subject1,$message1,$headers1); // the sender will receive the following information
			}
            else{                   // in case it fails to sends, show the following. then reload the contact site. 
            echo "<script>
                    alert('connection failure! Please try to reach us in a different way');        
                </script>";
			}
            }
            readfile('getintouch.html');
            ?>
