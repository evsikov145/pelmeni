<?php

header("Content-Type: text/html; charset=utf-8");

if(isset($_POST)) {

$data = json_decode($_POST['message'], true);

$email = "hunter37ru@yandex.ru"; #Email, на него придут письма
$title = "Заказ с сайта "; #Заголовок письма

if(isset($data) && !empty($data) ){
   $content = "\r\n";
   foreach ($data as $key => $value){
       $content .= "Товар: ".$value['title']." - Стоимость: ".$value['price']." - Колличество: ".$value['number'].";"."\r\n";
   }

$text = "
Информация о покупателе:

Имя: ".$_POST['name']."
Телефон: ".$_POST['phone']."
Адрес: ".$_POST['address']."
Заказ: ".$content."
Общая сумма заказа: ".$_POST['sum']." рублей.
Оплата: ".$_POST['payment']."
Заявка пришла с сайта:" . $_SERVER['HTTP_REFERER'] ."
Время заказа: ".date("Y-m-d H:i:s")."
IP адрес клиента: ". $_SERVER['REMOTE_ADDR'];

    if(mail($email, $title, $text)) {
    	//header('Location: thanks.html');
    } else {
    	echo "Ошибка. Возможно функция mail отключена. Обратитесь к хостинг-провайдеру или возьмите консультацию на сайте, где купили шаблон";
    }
}
} else {
	echo "Ошибка";
}