import { ChangePublicSong } from "application/useCases/ChangePublicSong";
import { CreateSong } from "application/useCases/CreateSong";
import assert from "assert";
import { Song } from "domain/entities/Song";
import { AlbumRepositoryMemory } from "infra/repositories/memory/AlbumRepositoryMemory";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory";
import { Identifier } from "infra/security/Identifier";

describe("Change Public Song", async () => {
  const identifier: Identifier = {
    createId() {
      return "1";
    },
  };

  const INITIAL_VALUE: Song.Props = {
    id: identifier.createId(),
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
  };

  const songRepository = new SongRepositoryMemory();
  const artistRepository = new ArtistRepositoryMemory();
  const albumRepository = new AlbumRepositoryMemory();

  const createSong = new CreateSong(
    songRepository,
    artistRepository,
    albumRepository,
    identifier
  );
  const songCreated = await createSong.execute(INITIAL_VALUE, "any");

  it("should change public song", async () => {
    const changePublicSong = new ChangePublicSong(songRepository);
    await changePublicSong.execute(songCreated.id);

    const songFinded = await songRepository.findById(songCreated.id);
    assert.deepEqual(songFinded.public, true);

    await changePublicSong.execute(songCreated.id);
    assert.deepEqual(songFinded.public, false);
  });
});
