<template>
  <div
    id="myGameRoom"
    style="height: 80vh; max-height: 100%; row-gap: 50px"
    class="d-flex flex-column justify-center align-center"
  >
    <div class="d-flex align-center" style="column-gap: 20px">
      <GameRoomPlayerCard
        v-if="player1.username.length > 0"
        :player="player1"
      />
      <GameRoomWaitingCard v-else />
      <h1>VS</h1>
      <GameRoomPlayerCard
        v-if="player2.username.length > 0"
        :player="player2"
      />
      <GameRoomWaitingCard v-else />
    </div>
    <div class="d-block">
      <v-btn
        v-if="player1.username.length > 0 && player2.username.length > 0 && (player1.username === currentUsername || player2.username === currentUsername)"
        x-large
        color="accent"
        @click="gameOn"
      >
        Ready !
      </v-btn>
      <v-btn x-large color="primary" to="/home"> Cancel </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import type { NuxtSocket } from "nuxt-socket-io";
import Vue from "vue";

export default Vue.extend({
  name: "GameRoom",
  data() {
    return {
      currentUsername: "",
      roomid: "",
      socket: {} as NuxtSocket,
      counter: 0,
      player1: {
        username: "",
        avatar: "",
        level: 0,
        mmr: 0,
        wins: 0,
        losses: 0,
      },
      player2: {
        username: "",
        avatar: "",
        level: 0,
        mmr: 0,
        wins: 0,
        losses: 0,
      },
    };
  },
  methods: {
    async gameOn() {
      this.socket.emit("launchGame", this.roomid);
    },
  },
  created: async function() {
    this.socket = this.$nuxtSocket({
      name: "gameroom",
      withCredentials: true,
      persist: "myGameSocket",
    });
    await this.$axios
      .get("/users/profile")
      .then((res: any) => {
        this.currentUsername = res.data.username;
      })
      .catch((error: any) => {
        console.error(error);
      });
  },
  beforeMount() {
    this.socket.on("handshake", (data) => {});
    this.socket.on("gamestart", (data) => {
      this.$router.push({ path: "/game", query: { roomid: this.roomid } });
    });
    this.socket.on("p1leaving", (data) => {
      this.player1 = {
        username: "",
        avatar: "",
        level: 0,
        mmr: 0,
        wins: 0,
        losses: 0,
      };
    });
    this.socket.on("change_room", (data) => {
      this.$router.push("/groom/selection");
    });
    this.socket.on("p2leaving", (data) => {
      this.player2 = {
        username: "",
        avatar: "",
        level: 0,
        mmr: 0,
        wins: 0,
        losses: 0,
      };
    });
    this.socket.on("infouserp1", (data) => {
      this.counter++;
      this.player1 = {
        ...this.player1,
        username: data.username,
        avatar:
          `${process.env.API_URL}` + "/users/profile/avatar/" + data.avatar,
        wins: data.wins,
        losses: data.losses,
        level: data.level,
        mmr: data.mmr,
      };
    });
    this.socket.on("infouserp2", (data) => {
      this.counter++;
      this.player2 = {
        ...this.player2,
        username: data.username,
        avatar:
          `${process.env.API_URL}` + "/users/profile/avatar/" + data.avatar,
        wins: data.wins,
        losses: data.losses,
        level: data.level,
        mmr: data.mmr,
      };
    });
  },
  mounted() {
    this.socket.emit("joinRoom", this.$route.query.name);
    this.roomid = this.$route.query.name as string;
  },
  beforeDestroy() {
    this.socket.emit("leaveRoom", this.roomid);
  },
});
</script>
