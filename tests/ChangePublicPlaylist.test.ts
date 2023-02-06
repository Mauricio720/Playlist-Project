import { CreatePlaylist } from "application/useCases/CreatePlaylst";
import { Playlist } from "domain/entities/Playlist";
import { PlaylistRepositoryMemory } from "infra/repositories/memory/PlaylistRepository";
import { Identifier } from "infra/security/Identifier";
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory";
import { Song } from "domain/entities/Song";
import assert from "assert";
import { ChangePublicPlaylist } from "application/useCases/ChangePublicPlaylist.";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { UserRepositoryMemory } from "infra/repositories/memory/UserRepositoryMemory";

describe("should create playlist", async () => {
  const identifier: Identifier = {
    createId() {
      return "1";
    },
  };

  const INITIAL_VALUES: Playlist.Props = {
    id: "1",
    title: "any",
    userId: "any",
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
        userId: "1",
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
        userId: "1",
      },
    ],
  };

  const playlistRepository = new PlaylistRepositoryMemory();
  const songRepository = new SongRepositoryMemory();
  const userRepository = new UserRepositoryMemory();

  await songRepository.create(INITIAL_VALUES.songs[0] as Song);
  await songRepository.create(INITIAL_VALUES.songs[1] as Song);

  const createPlaylist = new CreatePlaylist(
    playlistRepository,
    songRepository,
    userRepository,
    identifier
  );
  const playlistCreated = await createPlaylist.execute(INITIAL_VALUES);
  const changePublicPlaylist = new ChangePublicPlaylist(playlistRepository);

  it("should change public playlist", async () => {
    const playlistFinded = await playlistRepository.findById(
      playlistCreated.id
    );
    assert.deepEqual(playlistFinded.public, true);

    await changePublicPlaylist.execute(playlistFinded.id);
    assert.deepEqual(playlistFinded.public, false);
  });

  it("throw playlist not found", async () => {
    await assert.rejects(async () => {
      await changePublicPlaylist.execute("wrongId");
    }, new ObjectNotFound("Playlist"));
  });
});
