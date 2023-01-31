import assert from "assert";
import { Playlist } from "domain/entities/Playlist";
import { EmptyPlaylist } from "domain/errors/EmptyPlaylist";
import { FieldMissing } from "domain/errors/FieldMissing";

describe("Playlist", async () => {
  const INITIAL_VALUES: Playlist.Props = {
    id: "any",
    title: "any",
    user: {
      id: "any",
      name: "any",
      email: "any",
    },
    songs: [
      {
        id: "any",
        title: "any",
        category: {
          id: "any",
          name: "any",
        },
        duration: 1.0,
        pathSongFile: "any",
        artist: {
          id: "any",
          name: "any",
          picture: "any",
        },
        album: {
          id: "any",
          name: "any",
          year: "any",
          cover: "any",
          artist: {
            id: "any",
            name: "any",
            picture: "any",
          },
        },
        userId: "any",
      },

      {
        id: "any",
        title: "any2",
        category: {
          id: "any",
          name: "any",
        },
        duration: 2.0,
        pathSongFile: "any",
        artist: {
          id: "any",
          name: "any",
          picture: "any",
        },
        album: {
          id: "any",
          name: "any",
          year: "any",
          cover: "any",
          artist: {
            id: "any",
            name: "any",
            picture: "any",
          },
        },
        userId: "any",
      },
    ],
  };

  it("should create playlist", async () => {
    const playlist = new Playlist(INITIAL_VALUES);

    assert.deepEqual(playlist.id, "any");
    assert.deepEqual(playlist.title, "any");
    assert.deepEqual(playlist.user.id, "any");
    assert.deepEqual(playlist.songs.length, 2);
  });

  it("throw error when title is not send", async () => {
    assert.throws(() => {
      new Playlist({ ...INITIAL_VALUES, title: "" });
    }, new FieldMissing("Title"));
  });

  it("throw error when user is not send", async () => {
    assert.throws(() => {
      new Playlist({ ...INITIAL_VALUES, user: null });
    }, new FieldMissing("User"));
  });

  it("throw error when list song is not send", async () => {
    assert.throws(() => {
      new Playlist({ ...INITIAL_VALUES, songs: null });
    }, new FieldMissing("Songs List"));
  });

  it("throw error when empty song list is send", async () => {
    assert.throws(() => {
      new Playlist({ ...INITIAL_VALUES, songs: [] });
    }, new EmptyPlaylist());
  });
});
