Function.prototype.member = function(name, value){
	this.prototype[name] = value
}

//////// Game Definition
function Game(){}
Game.start = function(room, welcome){
	game.start(room.id)
	printMessage(welcome)
}

Game.end = function(){
	game.clear()
}

Game.move = function(room){
	game.move(room.id)	
}

Game.handItem = function(){
	return game.getHandItem()
}

Game.setGameoverMessage = function(){
    game.setGameoverMessage("꼬리칸의 반란은 허무하게 끝나고 말았다...")
}

Game.combination = function(combination1, combination2, result) {
    game.makeCombination(combination1.id, combination2.id, result.id)
}

Game.setTimer = function() {
    game.setTimer("10", "1", "초")
}

Game.hideTimer = function() {
    game.hideTimer()
}


//////// Room Definition

function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)
}

Room.member('setRoomLight', function(intensity){
	this.id.setRoomLight(intensity)
})


//////// Object Definition

function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image

	if (room !== undefined){
		this.id = room.id.createObject(name, image)
	}
}

Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})

Object.member('resize', function(width){
	this.id.setWidth(width)
})

Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})

Object.member('getX', function(){
	return this.id.getX()
})

Object.member('getY', function(){
	return this.id.getY()
})

Object.member('locate', function(x, y){
	this.room.id.locateObject(this.id, x, y)
})

Object.member('move', function(x, y){
	this.id.moveX(x)
	this.id.moveY(y)
})

Object.member('show', function(){
	this.id.show()
})

Object.member('hide', function(){
	this.id.hide()
})

Object.member('open', function(){
	this.id.open()
})

Object.member('close', function(){
	this.id.close()
})

Object.member('lock', function(){
	this.id.lock()
})

Object.member('unlock', function(){
	this.id.unlock()
})

Object.member('isOpened', function(){
	return this.id.isOpened()
})

Object.member('isClosed', function(){
	return this.id.isClosed()
})

Object.member('isLocked', function(){
	return this.id.isLocked()
})

Object.member('pick', function(){
	this.id.pick()
})

Object.member('isPicked', function(){
	return this.id.isPicked()
})


//////// Door Definition
function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)

    // Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}

// inherited from Object
Door.prototype = new Object()

Door.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
})

Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})

Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})


//////// Keypad Definition
function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback
}

// inherited from Object
Keypad.prototype = new Object()

Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})

//////// DoorLock Definition
function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}

// inherited from Object
DoorLock.prototype = new Keypad()


/////// Item Definition
function Item(room, name, image){
	Object.call(this, room, name, image)
}

// inherited from Object
Item.prototype = new Object()

Item.member('onClick', function(){
	this.id.pick()
})

Item.member('isHanded', function(){
	return Game.handItem() == this.id
})



//////// Box Definition
function Box(room, name, closedImage, openedImage){
    Object.call(this, room, name, closedImage)
 
    // Box properties
    this.closedImage = closedImage
    this.openedImage = openedImage
 }
 // inherited from Object
 Box.prototype = new Object()
 
 Box.member('onClick', function() {
    if(this.id.isClosed()) {
       this.id.open()
    } else if(this.id.isOpened()) {
       this.id.close()
    }
 })
 Box.member('onOpen', function() {
    this.id.setSprite(this.openedImage)
 })
 Box.member('onClose', function() {
    this.id.setSprite(this.closedImage)
 })


 //////// Back Definition
function Back(room, name, image, connectedTo){
	Object.call(this, room, name, image)

    // Back properties
	this.connectedTo = connectedTo
}

// inherited from Object
Back.prototype = new Object()

Back.member('onClick', function(){
	Game.move(this.connectedTo)
})

/*
//////// Soldier Definition
function Soldier(room, name, closedImage, openedImage, count){
	Object.call(this, room, name, closedImage)

    // Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.count = count
}

// inherited from Object
Solider.prototype = new Object()

Soldier.member('onClick', function(){  // 어차피 오버라이딩함
    // if (Game.handItem() == room1.gun) {  // 앞방에 총 만들어 달라고 부탁,,
    playSound("gun.wav")
    if(this.count < 2) {
        this.count += 1
        printMessage("누군가가 총에 맞았다!")
    } else if (this.count == 2) {
        this.id.open()
        tunnel_nv.kill += 1
    } else {
        printMessage("군인이 죽어 있다.")
    }
//} else {
//     printMessage("군인들을 처치하고 앞으로 나아가자!")
//}
    
})

Soldier.member('onOpen', function(){  // 죽음
    printMessage("군인이 죽었다!")
    this.id.setSprite(this.opnedImage)
    this.id.locateObject(this.id, this.id.getX(), this.id.getY()+120)  // y좌표 +120
})

Soldier.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})
*/


//////////////////////////////////////////////////////////////////////////////

tunnel_dark = new Room("tunnel_dark", "bg_black.png")
tunnel_nv = new Room("tunnel_nv", "bg_tunnel_green.jpg")
tunnel_door = new Room("tunnel_door", "bg_infrontofDoor_green.png")
kindergarten = new Room("kindergarten", "bg_kindergarten.png")



/************************* 터널_깜깜 *************************/

/*
tunnel_dark.soldier = new Soldier(tunnel_dark, "soldier", "soldier1.png", "soldier1.png", 0)
tunnel_dark.soldier.resize(200)
tunnel_dark.soldier.locate(750, 350)
tunnel_dark.soldier.onClick = function() {
       // if (game.getHandItem() == room1.gun) {  // 앞방에 총 만들어 달라고 부탁,,
       playSound("gun.wav")
       if(this.count < 2) {
           this.count += 1
           printMessage("누군가가 총에 맞았다!")
           soldierX = Math.floor(Math.random() * 600 + 300)
           soldierY = Math.floor(Math.random() * 200 + 100)
           this.id.locate(soldierX, soldierY)
       } else if (this.count == 2) {
           printMessage("군인이 죽었다!")
           this.id.hide()
           tunnel_dark.nvGoggles.show()
           Game.hideTimer()
       } else {
           printMessage("군인이 죽었다!")
       }
  // } else {
  //     printMessage("누군가 가로막고 있는 것 같다.")
  // }
}
*/

tunnel_dark.nvGoggles = new Object(tunnel_dark, "nvGoggles", "nightVisionGoggles.png")
tunnel_dark.nvGoggles.resize(80)
tunnel_dark.nvGoggles.locate(600, 500)
//tunnel_dark.nvGoggles.hide()
tunnel_dark.nvGoggles.onClick = function() {
    Game.move(tunnel_nv)
    printMessage("이제야 앞이 보이네..")
    Game.setTimer()
}



/************************* 터널_야시경 착용 *************************/

tunnel_nv.kill = 0

tunnel_nv.toDoor = new Back(tunnel_nv, "toDoor", "door_closed_green.png", tunnel_door)
tunnel_nv.toDoor.resize(40)
tunnel_nv.toDoor.locate(650, 285)
tunnel_nv.toDoor.onClick = function() {
    if(tunnel_nv.kill == 1) {  // 군인 8명 죽였으면
        Game.move(this.connectedTo)
        Game.hideTimer()
    } else {  // 덜 죽였으면
        printMessage("이곳에 있는 군인을 모두 죽여야 한다.")
    }
}

/*
tunnel_nv.soldier1 = new Soldier(tunnel_nv, soldier1, "soldier3.png", "soldier3_dead.png", 0)
tunnel_nv.soldier1.resize(130)
tunnel_nv.soldier1.locate(750, 350)
//tunnel_nv.soldier.count = 0  // 나중에 객체화하기
tunnel_nv.soldier.onClick = function() {
   // if (Game.handItem() == room1.gun) {  // 앞방에 총 만들어 달라고 부탁,,
        playSound("gun.wav")
        if(this.count < 2) {
            this.count += 1
            printMessage("누군가가 총에 맞았다!")
        } else if (this.count == 2) {
            this.id.open()
            tunnel_nv.kill += 1
        } else {
            printMessage("군인이 죽어 있다.")
        }
   // } else {
   //     printMessage("군인들을 처치하고 앞으로 나아가자!")
   // }
}*/

tunnel_nv.back = new Back(tunnel_nv, "back", "back.png", tunnel_dark)  // 합치고 감옥으로 수정
tunnel_nv.back.resize(80)
tunnel_nv.back.locate(100, 650)



/************************* 터널_다음 방 문 앞 *************************/

tunnel_door.door = new Door(tunnel_door, "door", "door_closed_green.png", "door_open_green.png", kindergarten)
tunnel_door.door.resize(400)
tunnel_door.door.locate(645, 400)
tunnel_door.door.lock()
tunnel_door.door.onUnlock = function() {
    this.id.setWidth(315)
    this.id.moveY(5)
    this.id.setSprite(this.openedImage)
}
tunnel_door.door.video = 0  // 최초 1회만 비디오 실행
tunnel_door.door.onClick = function() {
	if(!this.id.isLocked() && tunnel_door.door.video == 0){
        Game.move(kindergarten)
        showVideoPlayer("kindergarten_intro.mp4")
        tunnel_door.door.video = 1
	} else if (!this.id.isLocked() && tunnel_door.door.video == 1){
        Game.move(kindergarten)
    } else {
        printMessage("남궁민수에게 열어달라고 부탁해야겠다.")
    }
}

tunnel_door.minsu = new Keypad(tunnel_door, "minsu", "namgungminsu_green.png", "0009", function(){
    tunnel_door.door.unlock()
    printMessage("철커덕")
})
tunnel_door.minsu.resize(500);
tunnel_door.minsu.locate(1020, 500)
tunnel_door.minsu.onClick = function() {
	if (tunnel_door.door.isLocked()) {
		printMessage("지금까지 죽인 사람 수");
		showKeypad("number", this.password, this.callback)
	} else {
		printMessage("나가셈")
	}
}

tunnel_door.back = new Back(tunnel_door, "back", "back.png", tunnel_nv)
tunnel_door.back.resize(80)
tunnel_door.back.locate(100, 650)


/************************* 유치원 *************************/

kindergarten.door1 = new Door(kindergarten, "door1", "door_left_close.png", "door_left_open.png", tunnel_door)
kindergarten.door1.resize(100)
kindergarten.door1.locate(100, 425)

kindergarten.door2 = new Door(kindergarten, "door2", "door_right_close.png", "door_right_open.png", tunnel_door)  // 임시 connectedTo
kindergarten.door2.resize(100)
kindergarten.door2.locate(1200, 430)
kindergarten.door2.lock()
kindergarten.door2.onUnlock = function() {
    kindergarten.door2.open()
    kindergarten.door2.setSprite("door_right_open.png")
}
kindergarten.door2.video = 0  // 최초 1회만 비디오 실행
kindergarten.door2.onClick = function() {  // 분기 안 됨
    if (this.id.isOpened() && kindergarten.door2.video == 0) {
        //game.move(다음방)
        //showVideoPlayer("비디오.mp4")
        this.id.video = 1
        Game.end()
    } else if (this.id.isOpened() && kindergarten.door2.video == 1) {
        //game.move(다음방)
        Game.end()
    } else {
        printMessage("남궁민수에게 열어달라고 부탁해야겠다.")
    }
}

kindergarten.board = new Object(kindergarten, "board", "whiteBoard_bong.jpg")
kindergarten.board.resize(300)
kindergarten.board.locate(850, 330)
kindergarten.board.onClick = function() {
    printMessage("이상한 낙서가...")
}

kindergarten.frame = new Object(kindergarten, "frame", "frame.png")
kindergarten.frame.resize(100)
kindergarten.frame.locate(430, 220)
kindergarten.frame.onClick = function() {
    printMessage("북극곰 사진이다.")
}

kindergarten.box1 = new Box(kindergarten, "box1", "4-cover-Box(Closed)-sw.png", "4-cover-Box(Opened)-sw.png")
kindergarten.box1.resize(100)
kindergarten.box1.locate(250, 530)
kindergarten.box1.lock()
kindergarten.box1.hide()
kindergarten.box1.onClick = function() {
	if(this.id.isOpened()){
		this.id.close()
		this.id.setSprite(this.closedImage);	
		kindergarten.scroll.hide()
	} else if (this.id.isClosed()){
		this.id.open()
		this.id.setSprite(this.openedImage);
        kindergarten.scroll.show()
	} else if (this.id.isLocked()) {
		printMessage("자물쇠로 잠겨 있다.")
	}
}

kindergarten.keypad1 = new Keypad(kindergarten, "keypad1", "keypad2-se.png", "438000", function(){
    kindergarten.box1.unlock()
    printMessage("철커덕")
})
kindergarten.keypad1.resize(12);
kindergarten.keypad1.locate(260, 555)
kindergarten.keypad1.hide()
kindergarten.keypad1.onClick = function() {
	if (kindergarten.box1.isLocked()) {
		printMessage("열차 한 바퀴는 몇 km?");
		showKeypad("telephone", this.password, this.callback)
	} else {
		printMessage("잠금이 해제되었다.")
	}
}

kindergarten.scroll = new Object(kindergarten, "scroll", "scroll.png")
kindergarten.scroll.resize(40)
kindergarten.scroll.locate(250, 540)
kindergarten.scroll.hide()
kindergarten.scroll.onClick = function() {
    showImageViewer("hint_paper.png", "")
}

kindergarten.bookcase = new Object(kindergarten, "bookcase", "bookcase.png")
kindergarten.bookcase.resize(400)
kindergarten.bookcase.locate(430, 420)
kindergarten.bookcase.lock()
kindergarten.bookcase.move = 0
kindergarten.bookcase.onUnlock = function() {
    if (kindergarten.bookcase.move == 0) {
        kindergarten.bookcase.moveX(50)
        kindergarten.dog.moveX(50)
        kindergarten.indian.moveX(50)
        kindergarten.bow.moveX(50)
        kindergarten.okja.moveX(50)
        kindergarten.train.moveX(50)
        kindergarten.remoteNoBattery.moveX(50)
        kindergarten.mars.moveX(50)
        kindergarten.reed.moveX(50)
        kindergarten.bookcase.move = 1
        kindergarten.box1.show()
        kindergarten.keypad1.show()
    }
}
kindergarten.bookcase.onClick = function() {  // 열쇠로 해도 안 움직임
    if (this.id.isLocked()) {
        printMessage("장식장을 자세히 살펴보니 뒤에 작은 공간과 열쇠구멍이 있다.")
    }
    if (Game.handItem() == kindergarten.key && kindergarten.bookcase.move == 0) {
        this.id.unlock()
        printMessage("열쇠로 여니 자동으로 장식장이 움직인다.")
    } else if (kindergarten.bookcase.move == 1) {
        printMessage("더 이상 움직이지 않는다.")
    }
}

kindergarten.dog = new Object(kindergarten, "dog", "dog.png")
kindergarten.dog.resize(50)
kindergarten.dog.locate(280, 370)
kindergarten.dog.onClick = function() {
    printMessage("강아지를 보면 파트라슈가 떠올라. 그 동화 제목이 뭐더라?")
}

kindergarten.indian = new Object(kindergarten, "indian", "indian.png")
kindergarten.indian.resize(50)
kindergarten.indian.locate(380, 360)
kindergarten.indian.onClick = function() {
    printMessage("인디언 인형이다.")
}

kindergarten.bow = new Object(kindergarten, "bow", "bow.png")
kindergarten.bow.resize(40)
kindergarten.bow.locate(480, 363)
kindergarten.bow.onClick = function() {
    printMessage("장난감 양궁활이다.")
}

kindergarten.okja = new Object(kindergarten, "okja", "okja.png")
kindergarten.okja.resize(70)
kindergarten.okja.locate(575, 373)
kindergarten.okja.onClick = function() {
    printMessage("하마 같기도 하고 돼지 같기도 한데...")
}

kindergarten.train = new Object(kindergarten, "train", "train.png")
kindergarten.train.resize(70)
kindergarten.train.locate(285, 475)
kindergarten.train.onClick = function() {
    printMessage("우리 열차랑 비슷하게 생겼네.")
}

kindergarten.mars = new Object(kindergarten, "mars", "mars.png")
kindergarten.mars.resize(50)
kindergarten.mars.locate(380, 460)
kindergarten.mars.onClick = function() {
    printMessage("화성 모형이다.")
}

kindergarten.reed = new Object(kindergarten, "reed", "reed.png")
kindergarten.reed.resize(50)
kindergarten.reed.locate(580, 460)
kindergarten.reed.onClick = function() {
    printMessage("갈대가 어떻게 여기서 자라지?")
}

kindergarten.box2 = new Box(kindergarten, "box2", "Box(Closed)-se.png", "Box(Opened)-se.png")
kindergarten.box2.resize(110)
kindergarten.box2.locate(1200, 670)
kindergarten.box2.lock()
kindergarten.box2.onClick = function() {
	if(this.id.isOpened()){
		this.id.close()
		this.id.setSprite(this.closedImage);	
		kindergarten.battery.hide()
	} else if (this.id.isClosed()){
		this.id.open()
		this.id.setSprite(this.openedImage);
        kindergarten.battery.show()
	} else if (this.id.isLocked()) {
		printMessage("자물쇠로 잠겨 있다.")
	}
}

kindergarten.keypad2 = new Keypad(kindergarten, "keypad2", "cryptex-sw.png", "WHITE", function(){
    kindergarten.box2.unlock()
    printMessage("철커덕")
})
kindergarten.keypad2.resize(36);
kindergarten.keypad2.locate(1165, 695)
kindergarten.keypad2.onClick = function() {
	if (kindergarten.box2.isLocked()) {
		printMessage("곰의 색깔은?");
		showKeypad("alphabet", this.password, this.callback)
	} else {
		printMessage("잠금이 해제되었다.")
	}
}

kindergarten.remoteNoBattery = new Item(kindergarten, "remoteNoBattery", "리모컨.png")
kindergarten.remoteNoBattery.resize(70)
kindergarten.remoteNoBattery.locate(480, 485)

kindergarten.battery = new Item(kindergarten, "battery", "건전지.png")
kindergarten.battery.resize(30)
kindergarten.battery.locate(1190, 660)
kindergarten.battery.hide()

kindergarten.remote = new Item(kindergarten, "remote", "리모컨.png")
kindergarten.remote.hide()
Game.combination(kindergarten.remoteNoBattery, kindergarten.battery, kindergarten.remote)

kindergarten.tv = new Object(kindergarten, "tv", "tv.png")
kindergarten.tv.resize(200)
kindergarten.tv.locate(1050, 170)
kindergarten.tv.onClick = function() {  // 안 켜짐;;
    if(Game.handItem() == kindergarten.remote) {
        showVideoPlayer("kindergarten.mp4")
    } else {
        printMessage("리모컨으로 켜볼까?")
    }
}

kindergarten.cart = new Object(kindergarten, "cart", "cart.png")
kindergarten.cart.resize(250)
kindergarten.cart.locate(240, 650)

kindergarten.egghint = new Object(kindergarten, "egghint", "hint_egg.png")
kindergarten.egghint.resize(50)
kindergarten.egghint.locate(210, 653)
kindergarten.egghint.onClick = function() {
    showImageViewer("hint_egg.png", "")
    printMessage("글자가 가려져서 잘 안 보인다.")
}

kindergarten.memohint = new Object(kindergarten, "memohint", "memo.png")
kindergarten.memohint.resize(30)
kindergarten.memohint.locate(270, 630)
kindergarten.memohint.onClick = function() {
    showImageViewer("hint_memo.png", "")
    printMessage("이게 뭐지??")
}

kindergarten.eggs = new Object(kindergarten, "eggs", "eggs.png")
kindergarten.eggs.resize(200)
kindergarten.eggs.locate(237, 633)
kindergarten.eggs.onClick = function() {
    kindergarten.eggs.hide()
    printMessage("달걀 더미를 치웠다.")
}

kindergarten.minsu = new Keypad(kindergarten, "minsu", "namgungminsu.PNG", "1638542", function(){
    kindergarten.door2.unlock()
    printMessage("철커덕")
})
kindergarten.minsu.resize(150);
kindergarten.minsu.locate(1020, 380)
kindergarten.minsu.onClick = function() {
	if (kindergarten.door2.isLocked()) {
		printMessage("그래서 비밀번호는?");
		showKeypad("telephone", this.password, this.callback)
	} else {
		printMessage("나가셈")
	}
}

kindergarten.lecturedesk = new Object(kindergarten, "lecturedesk", "lectureDesk.png")
kindergarten.lecturedesk.resize(200)
kindergarten.lecturedesk.locate(1000, 550)
kindergarten.lecturedesk.onClick = function() {
    printMessage("윌포드 산업 로고가 새겨진 교탁이다.")
}

kindergarten.note = new Object(kindergarten, "note", "note.png")
kindergarten.note.resize(60)
kindergarten.note.locate(1000, 450)
kindergarten.note.onClick = function() {
    showImageViewer("bearquiz.png", "")
    printMessage("재미없는데..")
}

kindergarten.key = new Item(kindergarten, "key", "key.png")
kindergarten.key.resize(50)
kindergarten.key.locate(550, 650)

kindergarten.desk1 = new Object(kindergarten, "desk1", "desk.png")
kindergarten.desk1.resize(180)
kindergarten.desk1.locate(520, 600)
kindergarten.desk1.onClick = function() {
    printMessage("윌포드 산업 로고가 새겨진 책상이다.")
}
kindergarten.desk1.move = 0
kindergarten.desk1.onDrag = function(direction) {
    if (direction == "Left" && kindergarten.desk1.move == 0) {
        printMessage("책상을 밀었다!")
        this.id.moveX(-50)
        kindergarten.desk1.move = 1
    } else {
        printMessage("윌포드 산업 로고가 새겨진 책상이다.")
    }
}

kindergarten.desk2 = new Object(kindergarten, "desk2", "desk.png")
kindergarten.desk2.resize(180)
kindergarten.desk2.locate(750, 600)
kindergarten.desk2.onClick = function() {
    printMessage("윌포드 산업 로고가 새겨진 책상이다.")
}

kindergarten.child = new Object(kindergarten, "child", "child1.png")
kindergarten.child.resize(100)
kindergarten.child.locate(750, 432)
kindergarten.child.onClick = function() {
    if (this.id.isClosed()){
        this.id.open()
        this.id.setSprite("child2.png")
        printMessage("책상 밑에 뭐가 떨어져 있는 것 같아요. 주워 주세요!")
    } else {
        this.id.close()
        this.id.setSprite("child1.png")
        playSound("kindergarten_song.wav")
        printMessage("♪ 엔진이 멈추면 무슨 일이 생길까? 우리 모두 얼어 죽는다네 ♬..")
    }
}


///////////////////////////////////////////////////////////////////////////////////////

Game.start(tunnel_dark)
//Game.start(tunnel_nv)
//Game.start(tunnel_door)
//Game.start(kindergarten)

//game.printStory("djwfjksjfo")

Game.setGameoverMessage()