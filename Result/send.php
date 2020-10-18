<?php
header("Content-Type': 'application/json;charset=utf-8");

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

if(isset($data) {
	
$email = "evsikovoleg145@gmail.com"; #Email, на него придут письма
$title = "Заказ с сайта "; #Заголовок письма

$text = "
Информация о покупателе:

Имя: ".$data[0]."
Телефон: ".$data[1]."
Адрес: ".$data[2]."
Заказ: ".$data[3]."
Заявка пришла с сайта:" . $_SERVER['HTTP_REFERER'] ."
Время заказа: ".date("Y-m-d H:i:s")."
IP адрес клиента: ". $_SERVER['REMOTE_ADDR'];

if(mail($email, $title, $text)) {
	header('Location: thanks.html');
} else {
	echo "Ошибка. Возможно функция mail отключена. Обратитесь к хостинг-провайдеру или возьмите консультацию на сайте, где купили шаблон";
}
} else {
	echo "Ошибка";
}
?>