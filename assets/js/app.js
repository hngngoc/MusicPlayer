const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'NGC_LEVENTS'

const cd = $('.cd')

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')

const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'vaicaunoicokhien ...',
            singer: 'GREY D, tlinh',
            path: './assets/music/vaicaunoicokhiennguoithaydoi.mp3',
            image: './assets/img/vaicaunoicohiennguoithaydoi.jpg'
        },
        {
            name: 'Trao',
            singer: 'Wren Evans',
            path: './assets/music/trao.mp3',
            image: './assets/img/trao.jpg'
        },
        {
            name: 'Sao Soi Đường Đêm',
            singer: 'Trung Trần',
            path: './assets/music/saosoiduongdem.mp3',
            image: './assets/img/saosoiduongdem.jpg'
        },
        {
            name: 'Lơ Mơ',
            singer: 'Mer',
            path: './assets/music/lomo.mp3',
            image: './assets/img/lomo.jpg'
        },
        {
            name: 'Kẻ Điên Tin Vào Tình Yêu',
            singer: 'Freak D Music',
            path: './assets/music/kedientinvaotinhyeu.mp3',
            image: './assets/img/kedientinvaotinhyeu.jpg'
        },
        {
            name: 'Em Không Hỉu?',
            singer: 'Changg',
            path: './assets/music/emkhonghieu.mp3',
            image: './assets/img/emkhonghieu.jpg'
        },
        {
            name: 'Đường tôi chở em về',
            singer: 'buitruonglinh',
            path: './assets/music/duongtoichoemve.mp3',
            image: './assets/img/duongtoichoemve.jpg'
        },
        {
            name: 'Có hẹn với thanh xuân',
            singer: 'MONSTAR',
            path: './assets/music/cohenvoithanhxuan.mp3',
            image: './assets/img/cohenvoithanhxuan.jpg'
        },
        {
            name: '1703 3',
            singer: 'W/n ft. Nâu, Duongg, Titie',
            path: './assets/music/17033.mp3',
            image: './assets/img/1702 3.jpg'
        }
    ],
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return`
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //Xử lý phóng to thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xử lý khi click play
        playBtn.onclick =function () {
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }

        //Khi bài hát được play
        audio.onplay = function (){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //Khi bài hát bị pause
        audio.onpause = function (){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                progress.value = progressPercent
            }
        }

        //Xử lý khi tua bài hát
        progress.oninput = function (e) {
            const seekTime = audio.duration /100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next bài hát
        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play() 
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev bài hát
        prevBtn.onclick = function() {  
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play() 
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi random bài hát
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xử lý next khi audio Ended
        audio.onended = function(e) {
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        //Xử lý lặp lại 1 bài hát
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        
        //Lắng nghe hành vi khi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                //Xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // Xử lý khi click vào option
                if( e.target.closest('.option')){
                    console.log('Đây là option');
                }
            }
        }

    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++  
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--  
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest', 
            })
        }, 300)
    },
    loadConfig: function(){
        this.isRandom  = this.config.isRandom
        this.isRepeat  = this.config.isRepeat

    },
    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        //Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        //Lắng nghe và xử lý các sự kiện
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy
        this.loadCurrentSong()

        //Render playlist
        this.render()  

        //Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()