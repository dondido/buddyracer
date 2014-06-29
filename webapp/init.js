window.onload = function() {
	preloader.parentNode.removeChild(preloader);
	Game = {
		score: 0,
		snds: document.getElementsByTagName("audio"),
		userClick: ["mousedown", "touchstart"][~~ ["ontouchstart" in document.documentElement]],
		init: function() {
			this.element = document.getElementById("swiffycontainer");
			this.content = [this.element.clientWidth, this.element.clientHeight];
			window.addEventListener("resize", function() {
				Game.reflow()
			}, false);
			this.reflow();
			var stage = new swiffy.Stage(this.element, swiffyobject);
			stage.start();
			this.entries;
			this.scoreList = localStorage.getItem("scoreList");
			this.scoreList = this.scoreList ? this.scoreList.split(",") : [];
			this.scoreboard = document.getElementById("scoreboard");
			this.submitScore = document.getElementById("submit-score");
			this.nameInput = document.getElementById("name-input");
			this.submitScoreBtn = this.submitScore.querySelector(".btn");
			this.scoreboardList = scoreboard.querySelector(".list tbody");
			this.closeScoreBtn = scoreboard.querySelector(".close-btn");
			this.deleteScoreBtn = scoreboard.querySelector(".clear-btn");
			this.selectAllEntriesBtn = scoreboard.querySelector("thead");
			this.srcCode = document.getElementById("src-code");
			this.closeSrcBtn = this.srcCode.querySelector(".close-btn")
		},
		
		reflow: function() {
			var browser = [window.innerWidth | 0, window.innerHeight | 0];
			var scale = Math.min(browser[0] / this.content[0], browser[1] / this.content[1]);
			var size = [this.content[0] * scale, this.content[1] * scale];
			var offset = [(browser[0] - size[0]) / 2, (browser[1] - size[1]) / 2];
			var rule = "translate(" + ~~offset[0] + "px, " + ~~offset[1] + "px) scale(" + scale + ")";
			this.element.style.transform = rule;
			this.element.style.webkitTransform = rule;
			this.element.style.msTransform = rule;
			this.element.style.MozTransform = rule
		},
		
		showMain: function() {},
		
		hideMain: function() {},
		
		playSound: function(soundData) {
			soundData = soundData.split(",");
			var soundId = soundData[0].toLowerCase();
			var looping = !! (+soundData[1]);
			try {
				Android.playSnd(soundId, looping.toString())
			} catch (err) {
				var audio = document.getElementById(soundId);
				if (audio.currentTime) {
					var newAudio = document.getElementById(soundId + 1);
					if (!newAudio) {
						newAudio = audio.cloneNode(true);
						newAudio.id = audio.id + 1;
						audio.parentNode.insertBefore(newAudio, audio)
					}
					audio = newAudio
				}
				audio.loop = looping;
				audio.play();
			}
		},
		
		stopSound: function() {
			try {
				Android.stopSnd()
			} catch (err) {
				var l = this.snds.length;
				while (l--) {
					this.snds[l].pause()
				}
			}
		},
		
		selectAllEntries: function() {
			var selectedRows = Game.scoreboardList.querySelectorAll("tr");
			var l = selectedRows.length;
			this.className = this.className == "checked" ? "" : "checked";
			while (l--) {
				selectedRows[l].className = this.className
			}
		},
		
		matchChecked: function(e) {
			var target = e.target,
				success = false;
			while (target != this) {
				if (target.nodeName == "TR") {
					if (~target.className.indexOf("checked")) {
						target.className = ""
					} else {
						target.className = "checked"
					}
					break
				}
				target = target.parentNode
			}
		},
		
		displaySrc: function() {
			Game.toggleDisplay(Game.srcCode);
			this.closeSrcBtn.addEventListener(Game.userClick, Game.closeSrc, false)
		},
		
		closeSrc: function() {
			Game.toggleDisplay(Game.srcCode);
			this.removeEventListener(Game.userClick, Game.closeSrc, false)
		},
		
		deleteScore: function() {
			var el;
			var selectedRows = Game.scoreboardList.querySelectorAll("tr");
			var l = selectedRows.length;
			while (l--) {
				if (selectedRows[l].className == "checked") {
					el = selectedRows[l];
					el.parentNode.removeChild(el);
					Game.scoreList.splice(selectedRows.length - (l + 1), 1)
				}
			}
			localStorage.setItem("scoreList", Game.scoreList)
		},
		
		toggleDisplay: function(el) {
			var cssClass = el.className;
			el.className = ~cssClass.indexOf("displayed") ? cssClass.replace("displayed", "") : cssClass + " displayed"
		},
		
		openMoreGames: function() {
			window.open("http://publicgamelibrary.com", "_blank")
		},
		
		recordScore: function(score) {
			Game.score = score;
			Game.toggleDisplay(Game.submitScore);
			this.submitScoreBtn.addEventListener("click", Game.updateScoreboard, false);
			var lastEntry = Game.scoreList.length && Game.scoreList[Game.scoreList.length - 1].split("-");
			Object.prototype.toString.call(lastEntry) === "[object Array]" && (Game.nameInput.setAttribute("data-entryId", +lastEntry[0] + 1), Game.nameInput.value = lastEntry[1])
		},
		
		updateScoreboard: function() {
			var currentTime = new Date();
			
			var mins = currentTime.getMinutes();
			
			Game.submitScoreBtn.removeEventListener(Game.userClick, Game.updateScoreboard);
			Game.toggleDisplay(Game.submitScore);
			mins < 10 && (mins = "0" + mins);
			Game.scoreList.push(Game.nameInput.getAttribute("data-entryId") + "-" + Game.nameInput.value + "-" + currentTime.getDate() + "/" + (currentTime.getMonth() + 1) + "/" + currentTime.getFullYear().toString().substring(2) + "<br/>" + currentTime.getHours() + ":" + mins + "-" + Game.score);
			localStorage.setItem("scoreList", Game.scoreList)
		},
		
		closeScore: function() {
			Game.toggleDisplay(scoreboard);
			Game.closeScoreBtn.removeEventListener(Game.userClick, Game.closeScore);
			Game.deleteScoreBtn.removeEventListener(Game.userClick, Game.deleteScore);
			Game.selectAllEntriesBtn.removeEventListener(Game.userClick, Game.selectAllEntries)
		},
		
		displayScore: function() {
			var scoreListLength = Game.scoreList.length,
				tr, input, td;
			this.closeScoreBtn.addEventListener(Game.userClick, Game.closeScore, false);
			this.deleteScoreBtn.addEventListener(Game.userClick, Game.deleteScore, false);
			this.selectAllEntriesBtn.addEventListener(Game.userClick, Game.selectAllEntries, false);
			this.scoreboardList.addEventListener(Game.userClick, Game.matchChecked, false);
			this.selectAllEntriesBtn.checked = false;
			for (var i = this.scoreboardList.children.length, tr, entryData; i < scoreListLength; i++) {
				entryData = Game.scoreList[i].split("-");
				tr = document.createElement("tr");
				input = document.createElement("div");
				input.className = "checkbox";
				td = document.createElement("td");
				td.appendChild(input);
				tr.appendChild(td);
				for (var ii = 0, l = entryData.length; ii < l; ii++) {
					td = document.createElement("td");
					td.innerHTML = entryData[ii];
					tr.appendChild(td)
				}
				this.scoreboardList.insertBefore(tr, this.scoreboardList.firstChild)
			}
			this.toggleDisplay(scoreboard);
			this.entries = document.getElementsByName("game-entry")
		}
	};
	
	Game.init()
};