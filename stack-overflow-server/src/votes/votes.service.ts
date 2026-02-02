// import { BadRequestException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Vote } from './entities/vote.entity';
// import { CreateVoteDto } from './dto/create-vote.dto';

// @Injectable()
// export class VotesService {
//   constructor(
//     @InjectRepository(Vote)
//     private readonly voteRepo: Repository<Vote>,
//   ) {}

//   async vote(createVoteDto: CreateVoteDto) {
//     const { userId, entityType, entityId, voteType } = createVoteDto;

//     if (!['question', 'answer'].includes(entityType)) {
//       throw new BadRequestException('Invalid entity type');
//     }

//     if (!['upvote', 'downvote'].includes(voteType)) {
//       throw new BadRequestException('Invalid vote type');
//     }

//     const existingVote = await this.voteRepo.findOne({
//       where: { userId, entityType, entityId },
//     });

//     /**
//      * CASE 1: same vote → remove (toggle off)
//      */
//     if (existingVote && existingVote.voteType === voteType) {
//       await this.voteRepo.remove(existingVote);
//       return { message: 'Vote removed' };
//     }

//     /**
//      * CASE 2: different vote → update
//      */
//     if (existingVote) {
//       existingVote.voteType = voteType;
//       await this.voteRepo.save(existingVote);
//       return { message: 'Vote updated', voteType };
//     }

//     /**
//      * CASE 3: no vote → create
//      */
//     const vote = this.voteRepo.create({
//       userId,
//       entityType,
//       entityId,
//       voteType,
//     });

//     await this.voteRepo.save(vote);

//     return { message: 'Vote added', voteType };
//   }

// async getVoteCount(entityType: 'question' | 'answer', entityId: number) {
//   const upvotes = await this.voteRepo.count({
//     where: { entityType, entityId, voteType: 'upvote' },
//   });

//   const downvotes = await this.voteRepo.count({
//     where: { entityType, entityId, voteType: 'downvote' },
//   });

//   return { upvotes, downvotes };
// }
// }

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { CreateVoteDto } from './dto/create-vote.dto';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
  ) {}

  async vote(createVoteDto: CreateVoteDto) {
    const { userId, entityType, entityId, voteType } = createVoteDto;

    if (!['question', 'answer'].includes(entityType)) {
      throw new BadRequestException('Invalid entity type');
    }

    if (!['upvote', 'downvote'].includes(voteType)) {
      throw new BadRequestException('Invalid vote type');
    }

    const existingVote = await this.voteRepo.findOne({
      where: { userId, entityType, entityId },
    });

    let myVote: 'upvote' | 'downvote' | null = voteType;

    if (existingVote && existingVote.voteType === voteType) {
      await this.voteRepo.remove(existingVote);
      myVote = null;
    } else if (existingVote) {
      existingVote.voteType = voteType;
      await this.voteRepo.save(existingVote);
      myVote = voteType;
    } else {
      const vote = this.voteRepo.create({
        userId,
        entityType,
        entityId,
        voteType,
      });
      await this.voteRepo.save(vote);
      myVote = voteType;
    }

    const upvotes = await this.voteRepo.count({
      where: { entityType, entityId, voteType: 'upvote' },
    });

    const downvotes = await this.voteRepo.count({
      where: { entityType, entityId, voteType: 'downvote' },
    });

    return {
      upvotes,
      downvotes,
      score: upvotes - downvotes,
      myVote,
    };
  }
  async getVoteCount(entityType: 'question' | 'answer', entityId: number) {
    const upvotes = await this.voteRepo.count({
      where: { entityType, entityId, voteType: 'upvote' },
    });

    const downvotes = await this.voteRepo.count({
      where: { entityType, entityId, voteType: 'downvote' },
    });

    return { upvotes, downvotes };
  }
}
