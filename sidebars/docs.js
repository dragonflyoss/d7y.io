module.exports = {
  docs: [
    {
      type: 'doc',
      id: 'introduction',
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        {
          type: 'category',
          label: 'Quick Start',
          link: {
            type: 'doc',
            id: 'getting-started/quick-start',
          },
          items: [
            {
              type: 'autogenerated',
              dirName: 'getting-started/quick-start',
            },
          ],
        },
        {
          type: 'category',
          label: 'Installation',
          items: ['getting-started/installation/helm-charts', 'getting-started/installation/binaries'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      items: [
        {
          type: 'category',
          label: 'Best Practices',
          items: [
            'operations/best-practices/deployment-best-practices',
            {
              type: 'category',
              label: 'Observability',
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'operations/best-practices/observability',
                },
              ],
            },
            {
              type: 'category',
              label: 'Security',
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'operations/best-practices/security',
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Deployment',
          items: [
            'operations/deployment/architecture',
            {
              type: 'category',
              label: 'Applications',
              items: [
                'operations/deployment/applications/manager',
                'operations/deployment/applications/scheduler',
                'operations/deployment/applications/client',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Integrations',
          items: [
            {
              type: 'category',
              label: 'Container Runtime',
              items: [
                'operations/integrations/container-runtime/containerd',
                'operations/integrations/container-runtime/singularity',
                'operations/integrations/container-runtime/docker',
                'operations/integrations/container-runtime/cri-o',
                'operations/integrations/container-runtime/podman',
                'operations/integrations/container-runtime/nydus',
                'operations/integrations/container-runtime/stargz',
              ],
            },
            'operations/integrations/harbor',
            'operations/integrations/hugging-face',
            'operations/integrations/git-lfs',
            'operations/integrations/torchserve',
            'operations/integrations/triton-server',
            'operations/integrations/upgrade',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        {
          type: 'category',
          label: 'Configuration',
          items: [
            'reference/configuration/manager',
            'reference/configuration/scheduler',
            {
              type: 'category',
              label: 'Client',
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'reference/configuration/client',
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Commands',
          items: [
            'reference/commands/manager',
            'reference/commands/scheduler',
            {
              type: 'category',
              label: 'Client',
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'reference/commands/client',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Advanced Guides',
      items: [
        {
          type: 'category',
          label: 'Web Console',
          link: {
            type: 'doc',
            id: 'advanced-guides/web-console',
          },
          items: [
            'advanced-guides/web-console/signin',
            'advanced-guides/web-console/signup',
            'advanced-guides/web-console/cluster',
            {
              type: 'category',
              label: 'Developer',
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'advanced-guides/web-console/developer',
                },
              ],
            },
            {
              type: 'category',
              label: 'Job',
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'advanced-guides/web-console/job',
                },
              ],
            },
            'advanced-guides/web-console/user',
          ],
        },
        'advanced-guides/leech',
        'advanced-guides/preheat',
        'advanced-guides/task-manager',
        'advanced-guides/personal-access-tokens',
      ],
    },
    {
      type: 'category',
      label: 'Development Guides',
      items: [
        'development-guide/configure-development-environment',
        {
          type: 'category',
          label: 'Plugins',
          items: ['development-guide/plugins/out-of-tree-plugins', 'development-guide/plugins/in-tree-plugin'],
        },
        'development-guide/running-tests',
      ],
    },
    {
      type: 'category',
      label: 'Roadmap',
      items: [
        {
          type: 'autogenerated',
          dirName: 'roadmap',
        },
      ],
    },
    {
      type: 'doc',
      id: 'faq',
    },
  ],
};
