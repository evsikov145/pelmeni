<?php

header("Content-Type: text/html; charset=utf-8");

if(isset($_POST)) {

$name = $_POST['name'];
$phone = $_POST['phone'];
$address = $_POST['address'];
$sum = $_POST['sum'];
$payment = $_POST['payment'];
$data = json_decode($_POST['message'], true);
$date = $_POST['date'];
$time = $_POST['time'];

if(isset($data) && !empty($data) ){
   $content = "\r\n";
   foreach ($data as $key => $value){
       $content .= "\r\n".$value['title']." - Стоимость: ".$value['price']." - Количество: ".$value['number'].";"."\r\n";
   }

$paramsArray = array(
		'fields' => array (
			'name_1' => $name,
			'77085_1' => array( '107011' => $phone ),
			'315961_1' => $address,
			'note_2' => $content,
			'price_2'=> $sum,
			'315963_1' => $payment,
			'334889_1' => $date,
			'334891_1' => $time
		),
		'form_id' => '697279',
		'hash' => '4bbeb0a5dc90114401cc90ed069022ed'
	);
	// преобразуем массив в URL-кодированную строку
	$vars = http_build_query($paramsArray);
	// создаем параметры контекста
	$options = array(
		'http' => array(
			'method'  => 'POST',  // метод передачи данных
			'header'  => 'Content-type: application/x-www-form-urlencoded',  // заголовок
			'content' => $vars  // переменные
		)
	);
	$context  = stream_context_create($options);  // создаём контекст потока
	$result = file_get_contents('https://forms.amocrm.ru/queue/add', false, $context); //отправляем запрос




$email = "hunter37ru@yandex.ru"; #Email, на него придут письма
$title = "Заказ с сайта "; #Заголовок письма



$text = "
Информация о покупателе:

Имя: ".$name."
Телефон: ".$phone."
Адрес: ".$address."
Заказ: ".$content."
Общая сумма заказа: ".$sum." рублей.
Оплата: ".$payment."
Дата доставки: ".$date."
Время доставки: ".$time."
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