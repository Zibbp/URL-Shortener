const app = new Vue({
  el: "#app",
  data: {
    url: "",
    error: "",
    formVisible: true,
    success: null,
    shortUrl: null,
  },
  methods: {
    async shortenUrl() {
      this.error = "";
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          url: this.url,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        this.formVisible = false;
        this.error = "";
        this.success = true;
        this.shortUrl = result.shortUrl;
      } else {
        const result = await response.json();
        console.log(result);
        this.error = result.err;
      }
    },
    async copy() {
      await navigator.clipboard.writeText(this.shortUrl);
    },
  },
});
