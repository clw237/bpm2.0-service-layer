import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from 'entities';
import { Repository } from 'typeorm';

@Injectable()
export default class WorkspaceRepository {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async getWorkspaceByName(
    workspaceName: string,
  ): Promise<Workspace | Workspace[]> {
    let workspace: Workspace | Workspace[];
    if (workspaceName === 'all') {
      workspace = await this.workspaceRepository.find();
    } else {
      const foundWorkspace = await this.workspaceRepository.findOne({
        where: { workspace_name: workspaceName },
      });

      if (!foundWorkspace) {
        throw new Error(`Workspace with name ${workspaceName} not found`);
      }

      workspace = foundWorkspace;
    }

    return workspace;
  }
}
