/* eslint-disable */
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';

export default class TagSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Tag);

    const baseId = BigInt(Date.now());

    await repository.insert([
      { tagId: baseId + 1n, tagName: 'javascript' },
      { tagId: baseId + 2n, tagName: 'typescript' },
      { tagId: baseId + 3n, tagName: 'reactjs' },
      { tagId: baseId + 4n, tagName: 'node.js' },
      { tagId: baseId + 5n, tagName: 'nestjs' },
      { tagId: baseId + 6n, tagName: 'postgresql' },
      { tagId: baseId + 7n, tagName: 'typeorm' },
      { tagId: baseId + 8n, tagName: 'html' },
      { tagId: baseId + 9n, tagName: 'css' },
      { tagId: baseId + 10n, tagName: 'docker' },
    ]);
  }
}
