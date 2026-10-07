/* 青岛木材与包装 — 全站交互 */
(function(){
  "use strict";

  /* 移动端汉堡菜单 */
  var burger = document.getElementById("hamburger");
  var nav = document.getElementById("navLinks");
  if (burger && nav) {
    burger.addEventListener("click", function(){
      nav.classList.toggle("open");
      var open = nav.classList.contains("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function(e){
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  /* 当前页面导航高亮 */
  var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a[data-nav]").forEach(function(a){
    if (a.getAttribute("data-nav").toLowerCase() === path) a.classList.add("active");
  });

  /* 数据计数动画 */
  function animateCount(el){
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = null;
    function frame(ts){
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.innerHTML = val.toLocaleString("en-US") + "<em>" + suffix + "</em>";
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counted = false;
  function checkCounters(){
    if (counted) return;
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    var rect = els[0].getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      counted = true;
      els.forEach(animateCount);
    }
  }
  window.addEventListener("scroll", checkCounters, {passive:true});
  checkCounters();

  /* 返回顶部 */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", function(){
      toTop.classList.toggle("show", window.scrollY > 600);
    }, {passive:true});
    toTop.addEventListener("click", function(){
      window.scrollTo({top:0, behavior:"smooth"});
    });
  }

  /* RFQ 表单验证 + mailto 提交 */
  var form = document.getElementById("rfqForm");
  if (form) {
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var ok = true;
      function check(id, test){
        var wrap = document.getElementById(id).closest(".field");
        var val = document.getElementById(id).value.trim();
        var valid = test(val);
        wrap.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
        return val;
      }
      var name = check("fName", function(v){ return v.length >= 2; });
      var company = check("fCompany", function(v){ return v.length >= 2; });
      var email = check("fEmail", function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); });
      var need = check("fNeed", function(v){ return v.length >= 10; });
      var phone = document.getElementById("fPhone").value.trim();
      if (!ok) {
        var firstBad = form.querySelector(".field.invalid input, .field.invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }
      var subject = encodeURIComponent("官网询价 RFQ — " + company + " / " + name);
      var body = encodeURIComponent(
        "姓名：" + name + "\n公司：" + company + "\n邮箱：" + email +
        "\n电话：" + (phone || "—") + "\n\n需求描述：\n" + need +
        "\n\n（此邮件由青岛木材与包装官网 RFQ 表单生成）"
      );
      window.location.href = "mailto:Evan.chen@qdlumberco.com?subject=" + subject + "&body=" + body;
      var note = document.getElementById("formNote");
      if (note) {
        note.style.display = "block";
        note.textContent = "已为您打开邮件客户端，请点击发送完成询价。我们通常在 1 个工作日内回复。";
      }
    });
    ["fName","fCompany","fEmail","fNeed"].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", function(){
        el.closest(".field").classList.remove("invalid");
      });
    });
  }
})();
