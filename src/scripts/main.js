(function () {
        /* Hero background video: respect reduced-motion */
        var heroVideo = document.getElementById("heroVideo");
        if (heroVideo && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          heroVideo.removeAttribute("autoplay");
          heroVideo.pause();
        }
        var TITLES = {
          home: "Best Graduation Balloons Near Me | Balloon Delivery & Decor",
          catalog: "Catalog — Balloons Lane",
          blog: "Balloon Blog — Balloons Lane",
          "post-halloween": "Halloween Balloons: Spooky-Fun Decor Ideas — Balloons Lane",
          "post-thanksgiving": "Thanksgiving Balloon Decor — Balloons Lane",
          "post-newyear": "New Year Balloons: Ring It In With Style — Balloons Lane",
          "post-decor-101": "Balloon Decor 101 — Balloons Lane",
          about: "About Us — Balloons Lane",
          contact: "Contact Form — Balloons Lane",
          terms: "Terms and Conditions — Balloons Lane",
          privacy: "Privacy Policy — Balloons Lane"
        };
        var NAV_OF = {
          home: "home", catalog: "catalog", blog: "blog",
          "post-halloween": "blog", "post-thanksgiving": "blog",
          "post-newyear": "blog", "post-decor-101": "blog",
          about: "", contact: "contact", terms: "", privacy: ""
        };
        var pendingScroll = null;

        function currentRoute() {
          var h = (location.hash || "#home").replace("#", "");
          if (h === "corporate" || h === "video") return "home";
          return document.getElementById("view-" + h) ? h : "home";
        }

        function render() {
          var rawHash = (location.hash || "#home").replace("#", "");
          var route = currentRoute();
          var views = document.querySelectorAll(".view");
          for (var i = 0; i < views.length; i++) {
            views[i].classList.toggle("active", views[i].id === "view-" + route);
          }
          var navKey = NAV_OF[route];
          var links = document.querySelectorAll("#mainNav a[data-nav]");
          for (var j = 0; j < links.length; j++) {
            // Only the current page's own link is active; in-page scroll links (Corporate / Yt Video) never take the active state
            var isActive = links[j].getAttribute("data-nav") === navKey && !links[j].hasAttribute("data-scrollto");
            links[j].classList.toggle("active", isActive);
            if (isActive) links[j].setAttribute("aria-current", "page");
            else links[j].removeAttribute("aria-current");
          }
          document.title = TITLES[route] || TITLES.home;
          document.getElementById("mainNav").classList.remove("open");
          document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
          var targetId = null;
          if (rawHash === "corporate" || rawHash === "video") targetId = rawHash;
          else if (pendingScroll) targetId = pendingScroll;
          pendingScroll = null;
          if (targetId) {
            var target = document.getElementById(targetId);
            if (target) { target.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
          }
          window.scrollTo(0, 0);
        }

        // Nav links that scroll to a home section (Corporate / Yt Video, like the original menu)
        var scrollLinks = document.querySelectorAll("a[data-scrollto]");
        for (var s = 0; s < scrollLinks.length; s++) {
          scrollLinks[s].addEventListener("click", function (e) {
            pendingScroll = this.getAttribute("data-scrollto");
            if ((location.hash || "") === this.getAttribute("href")) { e.preventDefault(); render(); }
          });
        }

        window.addEventListener("hashchange", render);

        // FAQ accordions (everywhere .faq-item is used): answers hidden until the question is clicked; click again to collapse
        var faqItems = document.querySelectorAll(".faq-item");
        for (var q = 0; q < faqItems.length; q++) {
          (function (item) {
            var btn = item.querySelector(".faq-q");
            var panel = item.querySelector(".faq-a");
            if (!btn || !panel) return;
            btn.addEventListener("click", function () {
              var wasOpen = item.classList.contains("open");
              var siblings = item.parentElement.querySelectorAll(".faq-item.open");
              for (var o = 0; o < siblings.length; o++) {
                siblings[o].classList.remove("open");
                siblings[o].querySelector(".faq-a").hidden = true;
                siblings[o].querySelector(".faq-q").setAttribute("aria-expanded", "false");
              }
              if (!wasOpen) {
                item.classList.add("open");
                panel.hidden = false;
                btn.setAttribute("aria-expanded", "true");
              }
            });
          })(faqItems[q]);
        }

        var toggle = document.getElementById("menuToggle");
        toggle.addEventListener("click", function () {
          var nav = document.getElementById("mainNav");
          var open = nav.classList.toggle("open");
          toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });

        // Catalog category pills: smooth-scroll inside the catalog view
        var pills = document.querySelectorAll(".cat-pills button[data-scroll]");
        for (var k = 0; k < pills.length; k++) {
          pills[k].addEventListener("click", function () {
            for (var m = 0; m < pills.length; m++) pills[m].classList.remove("active");
            this.classList.add("active");
            var target = document.getElementById(this.getAttribute("data-scroll"));
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }

        // Contact forms (home + catalog + contact page): compose a ready-to-send message (email / WhatsApp)
        var forms = document.querySelectorAll(".quote-form");
        for (var f = 0; f < forms.length; f++) {
          (function (form) {
            var card = form.closest(".form-card");
            var success = card.querySelector(".form-success");
            form.addEventListener("submit", function (e) {
              e.preventDefault();
              if (!form.checkValidity()) { form.reportValidity(); return; }
              function val(n) { var el = form.querySelector("[name='" + n + "']"); return el ? el.value.trim() : ""; }
              var lines = [
                "Hi Balloons Lane! I'd like to order balloons.",
                "",
                "Name: " + val("name"),
                "Email: " + val("email"),
                "Phone: " + val("phone"),
                "Event date: " + val("date")
              ];
              if (val("zip")) lines.push("Delivery zip code: " + val("zip"));
              if (val("occasion")) lines.push("Occasion / Event / theme: " + val("occasion"));
              if (val("message")) lines.push("Message: " + val("message"));
              var fileEl = form.querySelector("[name='attach']");
              if (fileEl && fileEl.files && fileEl.files.length) {
                lines.push("Design I like: " + fileEl.files[0].name + " (I will attach it with my message)");
              }
              var text = lines.join("\n");
              success.querySelector(".summary-box").textContent = text;
              success.querySelector(".send-email").href =
                "mailto:laneballoon@gmail.com?subject=" +
                encodeURIComponent("Balloons Order — " + val("name") + " (" + val("date") + ")") +
                "&body=" + encodeURIComponent(text);
              success.querySelector(".send-wa").href =
                "https://wa.me/17184270968?text=" + encodeURIComponent(text);
              form.style.display = "none";
              success.classList.add("show");
              success.scrollIntoView({ behavior: "smooth", block: "center" });
            });
            success.querySelector(".edit-form").addEventListener("click", function () {
              success.classList.remove("show");
              form.style.display = "";
            });
          })(forms[f]);
        }

        // Customer reviews carousel (catalog page): 3 reviews visible at a time, seamless auto-slide loop, arrows, dots, swipe
        var revRoot = document.getElementById("revCarousel");
        if (revRoot) {
          var revTrack = revRoot.querySelector(".rev-track");
          var revSlides = revRoot.querySelectorAll(".rev-slide");
          var revDots = revRoot.querySelectorAll(".rev-dots button");
          var revHalf = revSlides.length / 2;
          var revIdx = 0;
          var revTimer = null;
          var revReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          function revApply(animate) {
            revTrack.style.transition = animate ? "" : "none";
            var w = revSlides[0].getBoundingClientRect().width;
            revTrack.style.transform = "translateX(-" + revIdx * w + "px)";
            var active = ((revIdx % revHalf) + revHalf) % revHalf;
            for (var d = 0; d < revDots.length; d++) {
              revDots[d].classList.toggle("active", d === active);
            }
          }
          function revNext() {
            revIdx++;
            revApply(true);
            if (revIdx >= revHalf) {
              setTimeout(function () {
                if (revIdx >= revHalf) { revIdx -= revHalf; revApply(false); }
              }, 600);
            }
          }
          function revPrev() {
            if (revIdx === 0) {
              revIdx = revHalf;
              revApply(false);
              void revTrack.offsetWidth;
            }
            revIdx--;
            revApply(true);
          }
          function revPlay() {
            if (revReduce || revTimer) return;
            revTimer = setInterval(function () {
              if (document.hidden) return;
              var cat = document.getElementById("view-catalog");
              if (cat && !cat.classList.contains("active")) return;
              revNext();
            }, 5000);
          }
          function revPause() {
            if (revTimer) { clearInterval(revTimer); revTimer = null; }
          }
          revRoot.querySelector(".rev-next").addEventListener("click", revNext);
          revRoot.querySelector(".rev-prev").addEventListener("click", revPrev);
          for (var b = 0; b < revDots.length; b++) {
            revDots[b].addEventListener("click", function () {
              revIdx = parseInt(this.getAttribute("data-slide"), 10) || 0;
              revApply(true);
            });
          }
          revRoot.addEventListener("mouseenter", revPause);
          revRoot.addEventListener("mouseleave", revPlay);
          revRoot.addEventListener("focusin", revPause);
          revRoot.addEventListener("focusout", revPlay);
          var revTouchX = null;
          revRoot.addEventListener("touchstart", function (e) {
            revTouchX = e.touches[0].clientX;
            revPause();
          }, { passive: true });
          revRoot.addEventListener("touchend", function (e) {
            if (revTouchX === null) return;
            var dx = e.changedTouches[0].clientX - revTouchX;
            if (Math.abs(dx) > 40) { if (dx < 0) revNext(); else revPrev(); }
            revTouchX = null;
            revPlay();
          }, { passive: true });
          window.addEventListener("resize", function () {
            if (revIdx >= revHalf) revIdx = 0;
            revApply(false);
          });
          revApply(false);
          revPlay();
        }

        // Corporate client logos carousel (home page): seamless auto-slide loop, arrows, swipe
        var corpRoot = document.getElementById("corpCarousel");
        if (corpRoot) {
          var corpTrack = corpRoot.querySelector(".corp-track");
          var corpSlides = corpRoot.querySelectorAll(".corp-slide");
          var corpHalf = corpSlides.length / 2;
          var corpIdx = 0;
          var corpTimer = null;
          var corpReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          function corpApply(animate) {
            corpTrack.style.transition = animate ? "" : "none";
            var w = corpSlides[0].getBoundingClientRect().width;
            corpTrack.style.transform = "translateX(-" + corpIdx * w + "px)";
          }
          function corpNext() {
            corpIdx++;
            corpApply(true);
            if (corpIdx >= corpHalf) {
              setTimeout(function () {
                if (corpIdx >= corpHalf) { corpIdx -= corpHalf; corpApply(false); }
              }, 600);
            }
          }
          function corpPrev() {
            if (corpIdx === 0) {
              corpIdx = corpHalf;
              corpApply(false);
              void corpTrack.offsetWidth;
            }
            corpIdx--;
            corpApply(true);
          }
          function corpPlay() {
            if (corpReduce || corpTimer) return;
            corpTimer = setInterval(function () {
              if (document.hidden) return;
              var home = document.getElementById("view-home");
              if (home && !home.classList.contains("active")) return;
              corpNext();
            }, 2600);
          }
          function corpPause() {
            if (corpTimer) { clearInterval(corpTimer); corpTimer = null; }
          }
          corpRoot.querySelector(".corp-next").addEventListener("click", corpNext);
          corpRoot.querySelector(".corp-prev").addEventListener("click", corpPrev);
          corpRoot.addEventListener("mouseenter", corpPause);
          corpRoot.addEventListener("mouseleave", corpPlay);
          corpRoot.addEventListener("focusin", corpPause);
          corpRoot.addEventListener("focusout", corpPlay);
          var corpTouchX = null;
          corpRoot.addEventListener("touchstart", function (e) {
            corpTouchX = e.touches[0].clientX;
            corpPause();
          }, { passive: true });
          corpRoot.addEventListener("touchend", function (e) {
            if (corpTouchX === null) return;
            var dx = e.changedTouches[0].clientX - corpTouchX;
            if (Math.abs(dx) > 40) { if (dx < 0) corpNext(); else corpPrev(); }
            corpTouchX = null;
            corpPlay();
          }, { passive: true });
          window.addEventListener("resize", function () {
            if (corpIdx >= corpHalf) corpIdx = 0;
            corpApply(false);
          });
          corpApply(false);
          corpPlay();
        }

        render();
      })();
